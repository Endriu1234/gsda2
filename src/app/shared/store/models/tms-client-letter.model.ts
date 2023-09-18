import { TmsClient } from "./tms-client.model";
import * as _ from 'lodash';

export class TmsClientByLetter {
    public letter: string;
    public tmsClients: TmsClient[];

    constructor(letter: string, tmsClients: TmsClient[]) {
        this.letter = letter;
        this.tmsClients = _.cloneDeep(tmsClients);
    }
}