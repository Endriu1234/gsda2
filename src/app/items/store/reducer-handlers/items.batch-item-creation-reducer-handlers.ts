import * as _ from 'lodash';
import { State } from "../items.state";
import { filterRedmineProjects, filterSoftDevProjects } from 'src/app/shared/store/shared.reducer-handlers';
import { ProposedItem } from '../models/batchitemcreation/proposed-item.model';

export function setRedmineProjectsFilterForBatchItemCreationSdCriteria(state: State): State {
    const newState: State = _.cloneDeep(state);
    newState.batchItemCreationSdCriteriaSetupData.redmineProjectsFiltered
        = filterRedmineProjects(newState.itemsSetupData.redmineProjects, newState.batchItemCreationSdCriteriaFormData.value.targetRedmineProject);
    return newState;
}

export function setSoftDevProjectsFilterForBatchItemCreationSdCriteria(state: State): State {
    const newState: State = _.cloneDeep(state);
    newState.batchItemCreationSdCriteriaSetupData.softDevProjectsFiltered
        = filterSoftDevProjects(newState.itemsSetupData.softDevProjects, newState.batchItemCreationSdCriteriaFormData.value.sourceSoftDevProject);
    return newState;
}

export function setBatchItemCreationRecords(state: State, args: { proposedItems: ProposedItem[] }): State {
    const newState: State = _.cloneDeep(state);
    newState.batchItemCreationRecords = {
        currentIndex: -1,
        proposedItems: args.proposedItems
    }
    return newState;
}