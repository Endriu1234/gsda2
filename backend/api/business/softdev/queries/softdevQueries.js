const { query } = require("express");

module.exports.getSDActiveProjectsQuery = () => {
    return `SELECT 
    prd_version.aa_id AS product_version_id,
    prd_version.prv_version AS product_version_name,
    proj.pj_name AS project_name, 
    proj.pj_svn_branch AS product_branch,
    proj.pj_release_candidate AS product_release_candidate,
    proj.pj_dev_start AS product_dev_start,
    proj.pj_dev_end AS product_dev_end,  
    proj.pj_test_start AS product_test_start,   
    proj.pj_test_end AS product_test_end, 
    proj.pj_delivery_date product_delivery_date, 
    (SELECT gus_user_firstname || ' ' || gus_user_lastname FROM sd_live.global_users WHERE aa_id = proj.pj_testing_mngr_aa) AS product_testing_mgr,
    (SELECT gus_user_firstname || ' ' || gus_user_lastname FROM sd_live.global_users WHERE aa_id = proj.pj_program_mngr_aa) AS product_programming_mgr,
    (SELECT gus_user_firstname || ' ' || gus_user_lastname FROM sd_live.global_users WHERE aa_id =  proj.pj_project_mngr_aa) AS product_project_mgr,
    GET_EDD_APPROVERS(proj.aa_id) as edd_approvals 
FROM 
    sd_live.prod_version prd_version, sd_live.product product, sd_live.project proj
WHERE 
    prd_version.prv_product_aa = product.aa_id
    AND product.prd_id = 'GENE'
    AND prd_version.prv_is_active = 'Y'
    AND proj.pj_version_aa = prd_version.aa_id
    AND proj.pj_status not in ('Canceled', 'Closed', 'Delivered', 'Doc Reviewed', 'Doc Created', 'Finished', 'Scope Approved')
    AND proj.pj_active = 'Y' `};

module.exports.getTmsLocalUsersQuery = () => {
    return ` SELECT 
        lu.gus_user_id as login, 
        lu.gus_user_id_ext2 as tms_login,
        lu.gus_user_firstname as first_name,
        lu.gus_user_middlename as middle_name,
        lu.gus_user_lastname as last_name,
        lu.gus_mail_address as email
    FROM 
        sd_live.local_users lu `};

module.exports.getTmsClientsQuery = () => {
    return ` SELECT 
        cl.CLID as tms_client, 
        cl.CLNAME as tms_client_fullName
    FROM sd_live.tms_client_v cl 
    WHERE cl.CLID not like '#%' AND cl.CLID not like '4%' AND cl.CLID not like '~%' `};

module.exports.getSDRegressionQuery = (bForPacket) => {
    let query = `SELECT 
                    aa_uf_id AS issue_id,
                    iss_summary AS issue_summary,
                    iss_desc AS issue_description,
                    users.gus_user_id AS issue_registered_by
                FROM 
                    sd_live.issue issue, 
                    sd_live.issue_source source,
                    sd_live.product product,
                    sd_live.global_users users
                WHERE 
                    issue.aa_id = source.isr_issue_aa
                    AND issue.iss_product_aa = product.aa_id
                    AND issue.iss_reg_by_aa = users.aa_id
                    AND source.isr_source_type IN ('Autotesting', 'Acceptance Testing', 'Failed TC (regression)')
                    AND product.prd_id = 'GENE'
                    AND iss_is_active = 'Y' 
                    AND iss_status <> 'Canceled' `;

    if (bForPacket) {
        query += `AND iss_detection_version_aa IN (SELECT
                    prj.pj_version_aa
                FROM 
                    sd_live.project prj, sd_live.project pckt, sd_live.project_link prjlnk
                WHERE
                    prj.aa_id = prjlnk.pjl_project_aa
                    AND pckt.aa_id = prjlnk.pjl_parent_proj_aa
                    AND pckt.pj_version_aa = :productVersionId) `;
    }
    else
        query += `AND iss_detection_version_aa = :productVersionId `;

    return query;
};

module.exports.getSDProjectPotentialRedmineItemsByIssueQuery = (bForPacket) => {
    let query = getSelectSDProjectPotentialRedmineItems(true); 
    query +=   `FROM 
                    sd_live.issue issue, 
                    sd_live.issue_source source,
                    sd_live.product product
                WHERE 
                    issue.aa_id = source.isr_issue_aa
                    AND issue.iss_product_aa = product.aa_id
                    AND product.prd_id = 'GENE'
                    AND iss_is_active = 'Y' 
                    AND iss_status <> 'Canceled' `;

    if (bForPacket) {
        query += `AND iss_detection_version_aa IN (SELECT
                    prj.pj_version_aa
                FROM 
                    sd_live.project prj, sd_live.project pckt, sd_live.project_link prjlnk
                WHERE
                    prj.aa_id = prjlnk.pjl_project_aa
                    AND pckt.aa_id = prjlnk.pjl_parent_proj_aa
                    AND pckt.pj_version_aa = :productVersionId) `;
    }
    else
        query += `AND iss_detection_version_aa = :productVersionId `;

    return query;
};

module.exports.getSDProjectPotentialRedmineItemsByCrQuery = (bForPacket) => {
    let query = getSelectSDProjectPotentialRedmineItems(false);
    query +=   `FROM 
                    sd_live.issue        issue,
                    sd_live.change_request cr,
                    sd_live.PROD_VERSION pv
                WHERE 
                    cr.cr_planned_fix_ver_aa = pv.AA_ID
                    AND issue.aa_id = cr.CR_ISSUE_AA
                    AND iss_is_active = 'Y'
                    AND iss_status <> 'Canceled' `;

    if (bForPacket) {
        query += `AND pv.aa_id IN (SELECT
                    prj.pj_version_aa
                FROM 
                    sd_live.project prj, sd_live.project pckt, sd_live.project_link prjlnk
                WHERE
                    prj.aa_id = prjlnk.pjl_project_aa
                    AND pckt.aa_id = prjlnk.pjl_parent_proj_aa
                    AND pckt.pj_version_aa = :productVersionId) `;
    }
    else
        query += `AND pv.aa_id = :productVersionId `;

    return query;
};

module.exports.getSDProjectPotentialRedmineItemsByPossibleCrQuery = (bForPacket) => {
    let query = getSelectSDProjectPotentialRedmineItems(true);
    query +=   `FROM 
                    sd_live.issue        issue,
                    sd_live.issue_devline_eval_v devv
                WHERE 
                    issue.aa_id = devv.IDE_ISSUE_AA
                    AND iss_is_active = 'Y'
                    AND iss_status <> 'Canceled'
                    AND devv.ide_cr_aa is null
                    AND devv.IDE_AFFECTED <> 'N'
                    AND devv.IDE_APPROVED <> 'N' `;

    if (bForPacket) {
        query += `AND devv.IDE_VERSION_AA IN (SELECT
                    prj.pj_version_aa
                FROM 
                    sd_live.project prj, sd_live.project pckt, sd_live.project_link prjlnk
                WHERE
                    prj.aa_id = prjlnk.pjl_project_aa
                    AND pckt.aa_id = prjlnk.pjl_parent_proj_aa
                    AND pckt.pj_version_aa = :productVersionId) `;
    }
    else
        query += `AND devv.IDE_VERSION_AA = :productVersionId `;

    return query;
};

function getSelectWitoutCr() {
    return `SELECT 
                1 AS selected,
                :targetRedmineProject AS redmine_project,
                :redmineVersion AS REDMINE_VERSION,
                case
                    when issue.iss_type = 'Defect' Then
                    'Bug'
                    when (select issrc.isr_source_type
                            from sd_live.issue_source issrc
                            where issrc.isr_issue_aa = issue.aa_id
                            and rownum = 1) = 'Autotesting' and
                        issue.iss_type = 'Defect' Then
                    'Regression'
                    else
                    issue.iss_type
                end AS tracker,
                '' AS status,
                issue.iss_summary AS subject,
                issue.iss_desc AS description,
                issue.aa_uf_id AS issue, 
                issue.iss_user_18 AS tms,
                '' AS assignee,
                '' AS redmine_link, `
}

function getSelectSDProjectPotentialRedmineItems(combineCRs) {
    let select = getSelectWitoutCr();
    select += combineCRs ? `jacekk.Getcrsfromissuebyproject(issue.aa_id, :productVersionId) AS cr, ` : `cr.aa_uf_id AS cr, `;
    select += combineCRs ? `'' AS cr_est_hours ` : '(select ROUND(sl.iso_esth_code / 60, 1) from sd_live.issue_solution sl where sl.aa_id = cr.CR_ISSUE_SOLUTION_AA) AS cr_est_hours ';

    return select;
}

module.exports.getTmsProjectPotentialRedmineItems = (showClosed, showInClientBin) => {
    let showClosedAnd = showClosed ? ``:` AND tms.status <> 'C' `;
    let showInClientBinAnd = showInClientBin ? ``:` AND tms.employee Not like 'N/%' `;
    let query = `select 1 AS selected,
                    :targetRedmineProject AS redmine_project,
                    :redmineVersion AS REDMINE_VERSION,
                    'TMS Task' AS tracker,
                    '' AS status,
                    CLIENT || '-' || ID AS subject,
                    txt.PROBLEMFULLTEXT AS description,
                    case
                    when tms.SOFTDEV_ID like 'ISS%' Then
                    tms.SOFTDEV_ID
                    else
                    ''
                    end AS issue,
                    CLIENT || '-' || ID AS tms,
                    tms.employee AS assignee,
                    '' AS redmine_link, 
                    '' AS cr,
                    '' AS cr_est_hours
                from SD_LIVE.tms_problem_v         tms,
                    SD_LIVE.Tms_Problem_Full_Text txt
                where txt.TASK_AA_ID = tms.aa_id `;
    query += showClosedAnd;
    query += showInClientBinAnd;
    query += ` and tms.client = :iTMSClient
                and tms.createddatetime >= To_Date(:fromDate,'YYYY-MM-DD HH24:MI')
                and tms.createddatetime <= To_Date(:toDate,'YYYY-MM-DD HH24:MI') 
                and tms.employee = (case when :TmsUser is not null then :TmsUser else tms.employee end) `;

    return query;
}

module.exports.getQueryForIdsByIssuesPotentialRedmineItems = (cntParams) => {
    let paramsDeclaration = '';
    for (let index = 0; index < cntParams; index++) {
        paramsDeclaration += paramsDeclaration.length > 0 ? ',' : '';
        paramsDeclaration += ":par" + index;  
    }
    let query = getSelectWitoutCr();
    query += `  '' AS cr,
                '' AS cr_est_hours 
            FROM 
                sd_live.issue issue
            WHERE 
                issue.aa_uf_id in (${paramsDeclaration})  `;

    return query;
}

module.exports.getQueryForIdsByCrsPotentialRedmineItems = (cntParams) => {
    let paramsDeclaration = '';
    for (let index = 0; index < cntParams; index++) {
        paramsDeclaration += paramsDeclaration.length > 0 ? ',' : '';
        paramsDeclaration += ":par" + index;  
    }


    let query = getSelectSDProjectPotentialRedmineItems(false);
    query +=   `FROM 
                    sd_live.issue        issue,
                    sd_live.change_request cr
                WHERE 
                    issue.aa_id = cr.CR_ISSUE_AA
                    AND cr.aa_uf_id in (${paramsDeclaration}) `;

    return query;
}

module.exports.getQueryForIdsByTmsPotentialRedmineItems = (cntParams) => {
    let paramsDeclaration = '';
    for (let index = 0; index < cntParams; index++) {
        paramsDeclaration += paramsDeclaration.length > 0 ? ',' : '';
        paramsDeclaration += ":par" + index;  
    }
    
    let query = `SELECT 
                    1 AS selected,
                    :targetRedmineProject AS redmine_project,
                    :redmineVersion AS REDMINE_VERSION,
                    'TMS Task' AS tracker,
                    '' AS status,
                    CLIENT || '-' || ID AS subject,
                    txt.PROBLEMFULLTEXT AS description,
                    case
                    when tms.SOFTDEV_ID like 'ISS%' Then
                    tms.SOFTDEV_ID
                    else
                    ''
                    end AS issue,
                    CLIENT || '-' || ID AS tms,
                    tms.employee AS assignee,
                    '' AS redmine_link, 
                    '' AS cr,
                    '' AS cr_est_hours
                FROM 
                    SD_LIVE.tms_problem_v         tms,
                    SD_LIVE.Tms_Problem_Full_Text txt
                WHERE txt.TASK_AA_ID = tms.aa_id 
                    AND tms.client || '-' || tms.id IN (${paramsDeclaration}) `;

    return query;
}

module.exports.getCRValidationQuery = () => {
    return `select count(*) as existence from  sd_live.change_request_v cr where cr.AA_UF_ID = :changeRequest and rownum = 1`;
};

module.exports.getIssueValidationQuery = () => {
    return `select count(*) as existence from sd_live.issue iss where iss.aa_uf_id = :issue and rownum = 1`;
};

module.exports.getTmsValidationQuery = () => {
    return `select count(*) as existence from SD_LIVE.tms_problem_v tms where tms.client = :tmsClient and tms.id = :tmsId and rownum = 1`;
};

module.exports.getTmsClientValidationQuery = () => {
    return `select count(*) as existence from SD_LIVE.tms_problem_v tms where tms.client = :tmsClient and rownum = 1`;
};

module.exports.getItemDataByIssue = () => {
    return `SELECT ''             as cr_id,
                aa_uf_id          as issue_id,
                iss_summary       as item_summary,
                iss_desc          as item_description,
                iss_user_18       as tms_id
            FROM sd_live.issue       issue
            WHERE issue.aa_uf_id = :issue`;
}

module.exports.getItemDataByCR = () => {
    return `SELECT cr.aa_uf_id      as cr_id,
                cr.iss_uf_id        as issue_id,
                cr.iss_summary      as item_description,
                cr.cr_summary       as item_summary,
                cr.iss_user_18      as tms_id
            FROM sd_live.change_request_v cr
            WHERE cr.aa_uf_id = :cr`;
}

module.exports.getItemDataByTms = () => {
    return `SELECT ''                           as cr_id,
                tms.softdev_id                  as issue_id,
                txt.problemfulltext             as item_description,
                tms.client || '-' || tms.id     as item_summary,
                tms.client || '-' || tms.id     as tms_id
            FROM SD_LIVE.Tms_Problem_v tms, SD_LIVE.Tms_Problem_Full_Text txt
            WHERE txt.TASK_AA_ID = tms.aa_id
                AND tms.client = :tmsClient 
                AND tms.id = :tmsId`;
}