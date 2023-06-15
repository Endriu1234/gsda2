import { createReducer, on } from '@ngrx/store';
import { initialState, ItemCreationFromData, State } from './items.state';
import * as fromCommonReducerHanders from './reducer-handlers/items.common-reducer-handlers';
import * as fromItemCreationReducerHanders from './reducer-handlers/items.item-creation-reducer-handlers';
import * as fromBatchItemCreationReducerHanders from './reducer-handlers/items.batch-item-creation-reducer-handlers';

import { onNgrxForms, wrapReducerWithFormStateUpdate, updateGroup, validate, ValidationErrors } from 'ngrx-forms';
import { required } from 'ngrx-forms/validation';
import { initRedmineProjects, initRedmineTrackers, initRedmineUsers, initSoftDevProjects, loadRedmineProjects, loadRedmineTrackers, loadRedmineUsers, loadSoftDevProjects } from './actions/items.common-actions';
import { addValidatedCR, addValidatedFromId, addValidatedIssue, addValidatedTms, setRedmineProjectsFilterForItemCreation, setRedmineUsersByLetterFilter } from './actions/items.item-creation-actions';
import { setBatchItemCreationRecords, setRedmineProjectsFilterForBatchItemCreationSdCriteria, setSoftDevProjectsFilterForBatchItemCreationSdCriteria } from './actions/items.batch-item-creation-actions';

export const itemsReducerKey = 'items';

const validationReducer = updateGroup<ItemCreationFromData>({
    tracker: validate(required),
    subject: validate(required),
    description: validate(required),
    project: validate(required)
});

export const regularReducer = createReducer(initialState, onNgrxForms(),
    on(loadRedmineProjects, fromCommonReducerHanders.loadRedmineProjects),
    on(initRedmineTrackers, fromCommonReducerHanders.initRedmineTrackers),
    on(loadRedmineTrackers, fromCommonReducerHanders.loadRedmineTrackers),
    on(initRedmineUsers, fromCommonReducerHanders.initRedmineUsers),
    on(loadRedmineUsers, fromCommonReducerHanders.loadRedmineUsers),
    on(setRedmineUsersByLetterFilter, fromCommonReducerHanders.setRedmineUsersByLetterFilter),
    on(initRedmineProjects, fromCommonReducerHanders.initRedmineProjects),
    on(initSoftDevProjects, fromCommonReducerHanders.initSoftDevProjects),
    on(loadSoftDevProjects, fromCommonReducerHanders.loadSoftDevProjects),

    on(setRedmineProjectsFilterForItemCreation, fromItemCreationReducerHanders.setRedmineProjectsFilterForItemCreation),
    on(addValidatedCR, fromItemCreationReducerHanders.addValidatedCR),
    on(addValidatedIssue, fromItemCreationReducerHanders.addValidatedIssue),
    on(addValidatedTms, fromItemCreationReducerHanders.addValidatedTms),
    on(addValidatedFromId, fromItemCreationReducerHanders.addValidatedFromId),

    on(setRedmineProjectsFilterForBatchItemCreationSdCriteria, fromBatchItemCreationReducerHanders.setRedmineProjectsFilterForBatchItemCreationSdCriteria),
    on(setSoftDevProjectsFilterForBatchItemCreationSdCriteria, fromBatchItemCreationReducerHanders.setSoftDevProjectsFilterForBatchItemCreationSdCriteria),
    on(setBatchItemCreationRecords, fromBatchItemCreationReducerHanders.setBatchItemCreationRecords),
);

export const itemsReducer = wrapReducerWithFormStateUpdate(
    regularReducer,
    (state: State) => {
        return state.itemCreationFromData;
    },
    validationReducer
);

