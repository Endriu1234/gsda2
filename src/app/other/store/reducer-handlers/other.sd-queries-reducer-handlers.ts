import * as _ from 'lodash';
import { State } from '../state/other.state';

export function setSDOtherQueriesRecords(state: State, args: { rows: any[], columns: any[] }): State {
    const newState: State = _.cloneDeep(state);
    newState.softDevQueriesRecords.columns = args.columns;
    newState.softDevQueriesRecords.rows = args.rows;
    return newState;
}