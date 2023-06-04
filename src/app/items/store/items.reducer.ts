import { createReducer, on } from '@ngrx/store';
import {
    initRedmineTrackers, loadRedmineTrackers, initRedmineUsers, loadRedmineUsers, initRedmineProjects, loadRedmineProjects,
    addValidatedCR, addValidatedIssue, addValidatedTms, setRedmineUsersByLetterFilter,
    addValidatedFromId, setRedmineProjectsFilterForItemCreation, setRedmineProjectsFilterForBatchItemCreationSdCriteria,
    initSoftDevProjects, loadSoftDevProjects, setSoftDevProjectsFilterForBatchItemCreationSdCriteria
} from './items.actions';
import { initialState, ItemCreationFromData, State } from './items.state';
import * as fromCommonReducerHanders from './reducer-handlers/items.common-reducer-handlers';
import * as fromItemCreationReducerHanders from './reducer-handlers/items.item-creation-reducer-handlers';
import * as fromBatchItemCreationReducerHanders from './reducer-handlers/items.batch-item-creation-reducer-handlers';

import { onNgrxForms, wrapReducerWithFormStateUpdate, updateGroup, validate, ValidationErrors } from 'ngrx-forms';
import { required } from 'ngrx-forms/validation';

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
);

export const itemsReducer = wrapReducerWithFormStateUpdate(
    regularReducer,
    (state: State) => {
        return state.itemCreationFromData;
    },
    validationReducer
);

