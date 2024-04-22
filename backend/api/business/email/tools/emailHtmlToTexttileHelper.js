
const toTextile = require('to-textile');

module.exports.getTextileAndPicFromHtml = function (emailHtml) {
    const objHtmlAndPic = getSimpleHtmlAndPictures(emailHtml);

    let textile = toTextile(objHtmlAndPic.html, { converters: [
            {
                filter: 'span',
                replacement: function(innerHTML, node) {
                return innerHTML;
            }},
            {
                filter: 'div',
                replacement: function(innerHTML, node) {
                return innerHTML;
            }},
            {
                filter: 'hr',
                replacement: function(innerHTML, node) {
                return '&nbsp;';
            }}/*,
            {
                filter: 'p',
                replacement: function(content, node) {
                    var a = attrBlock(node);
                    if (a.length)
                        return '%%\n\np' + a + '. ' + content + '%%\n\n'
                    else
                        return '%%\n\n' + content + '%%\n\n'
        
                }
            }*/
        ] });

    return {
        textile: textile,
        originalHtml: emailHtml,
        changedHtml: objHtmlAndPic.html,
        pictures: objHtmlAndPic.pictures
    }
}


module.exports.insertAtBeginningHtml = function (emailHtml, htmlTextToInsert) {
    let retHtml = emailHtml;

    if (emailHtml && htmlTextToInsert) {
        const startTextHtml = "<body";
        const endBody = ">";

        let startIndex = emailHtml.indexOf(startTextHtml);
        let endIndex = emailHtml.indexOf(endBody, startIndex + startTextHtml.length);

        retHtml = emailHtml.slice(0, endIndex + endBody.length) + htmlTextToInsert + emailHtml.slice(endIndex + endBody.length, emailHtml.length);
    }

    return retHtml;
}


function getSimpleHtmlAndPictures(emailHtml) {
    let html = '';

    //remove comment
    html = removeBetweenStrings(emailHtml, "<!--", "-->");

    //remove styles
    html = removeBetweenStrings(html, "<style>", "</style>");
    html = removeBetweenStrings(html, ' style="', '"');

    //remove classes
    html = removeBetweenStrings(html, ' class="', '"');

    //remove other
    html = removeBetweenStrings(html, ' lang="', '"');
    //html = removeBetweenStrings(html, '&nbsp', ';');

    //prepare simple Html and extract pictures as Buffer
    const retObj = getHtmlWithPicturesArryBuffers(html);

    return retObj;
}

function removeBetweenStrings(text, startString, endString) {
    let retText = text

    if(text) {
        let startIndex = text.indexOf(startString);
        let endIndex = text.indexOf(endString, startIndex + startString.length);

        if (startIndex >= 0 && endIndex > startIndex && endIndex < text.length) {
            retText = text.slice(0, startIndex) + text.slice(endIndex + endString.length, text.length);
            retText = removeBetweenStrings(retText, startString, endString);
        }
    }

    return retText;
}


function getHtmlWithPicturesArryBuffers(emailHtml) {
    let objRet = {
        html: emailHtml,
        pictures: []
    };
    let num = 1;
    let pic_name = '';
    let replacedPic = '';
    let imgIndex = objRet.html.indexOf("<img");
    let startIdString = ' id="';
    let startString = ' src="';
    let endString = '"';

    do {
        pic_name = 'pic' + num + '_' + Date.now();

        if (imgIndex >= 0) {

            //remove image #id
            let startIdIndex = objRet.html.indexOf(startIdString, imgIndex);
            let endIdIndex = objRet.html.indexOf(endString, startIdIndex + startIdString.length);
            if (startIdIndex >= 0 && endIdIndex > startIdIndex && endIdIndex < objRet.html.length) {
                objRet.html = objRet.html.substring(0, startIdIndex) + objRet.html.substring(endIdIndex + endString.length);
            }
            
            //find image src
            let startIndex = objRet.html.indexOf(startString, imgIndex);
            let endIndex = objRet.html.indexOf(endString, startIndex + startString.length);

            if (startIndex >= 0 && endIndex > startIndex && endIndex < objRet.html.length) {
                //replace image by simple name
                replacedPic = objRet.html.substring(startIndex + startString.length, endIndex);

                //get and remove picture mimetype
                let picMimetype = 'image/jpeg';
                startIdIndex = replacedPic.indexOf("data:");
                endIdIndex = replacedPic.indexOf(";", startIdIndex + "data:".length);
                if (startIdIndex >= 0 && endIdIndex > startIdIndex && endIdIndex < replacedPic.length) {
                    picMimetype = replacedPic.substring(startIdIndex + "data:".length, endIdIndex);
                }
                
                let ext = picMimetype.substring(picMimetype.indexOf('/') + 1);
                pic_name = pic_name + "." + ext;
                objRet.html = objRet.html.replace(replacedPic, pic_name);

                endIdIndex = replacedPic.indexOf(",", startIdIndex + "data:".length);
                if (startIdIndex >= 0 && endIdIndex > startIdIndex && endIdIndex < replacedPic.length) {
                    replacedPic = replacedPic.substring(0, startIdIndex) + replacedPic.substring(endIdIndex + ",".length);
                }

                //get image buffer
                const tmp = {
                    name: pic_name,
                    mimetype: picMimetype,
                    picture: Buffer.from(replacedPic.replace('data:' + picMimetype + ';base64,',''), 'base64')
                }
                objRet.pictures.push(tmp);
                endIndex = objRet.html.indexOf(">", imgIndex);
                imgIndex = objRet.html.indexOf("<img", endIndex);
            } else {
                imgIndex = -1
            }
            num = num + 1;
        }

    } while (imgIndex >= 0)

    return objRet;
}