import * as _ from 'lodash';
import { State } from "../items.state";
import { filterRedmineProjects, filterSoftDevProjects } from 'src/app/shared/store/shared.reducer-handlers';

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