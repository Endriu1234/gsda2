import * as _ from 'lodash';
import { State } from "../state/items.state";
import { filterRedmineProjects, filterSoftDevProjects } from 'src/app/shared/store/shared.reducer-handlers';
import { ProposedItem } from '../models/batchitemcreation/proposed-item.model';
import { ItemCreationMode } from '../state/items.item-creation-state';

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

export function togglePropsedItemSelection(state: State, args: { proposedItem: ProposedItem }): State {
    const index = state.batchItemCreationRecords.proposedItems.findIndex(i => {
        return i.SUBJECT === args.proposedItem.SUBJECT
            && i.DESCRIPTION === args.proposedItem.DESCRIPTION
            && i.ISSUE === args.proposedItem.ISSUE
            && i.CR === args.proposedItem.CR
            && i.TMS === args.proposedItem.TMS
            && i.ASSIGNEE === args.proposedItem.ASSIGNEE
            && i.TRACKER === args.proposedItem.TRACKER;
    });

    const newState: State = _.cloneDeep(state);
    newState.batchItemCreationRecords.proposedItems = _.cloneDeep(newState.batchItemCreationRecords.proposedItems);
    const newItem = newState.batchItemCreationRecords.proposedItems[index];
    newItem.SELECTED = !newItem.SELECTED;
    return newState;
}

export function toggleAllPropsedItemsSelection(state: State): State {

    if (state.batchItemCreationRecords.proposedItems.length === 0)
        return state;

    const selectionCount = state.batchItemCreationRecords.proposedItems.reduce(function (n, item) {

        if (item.SELECTED)
            return n + 1;
        else
            return n;
    }, 0);

    const newState: State = _.cloneDeep(state);
    const selectionNewVal = !(selectionCount === state.batchItemCreationRecords.proposedItems.length);
    newState.batchItemCreationRecords.proposedItems.forEach(item => item.SELECTED = selectionNewVal);
    return newState;
}

export function startBatchItemsCreation(state: State): State {
    const newState = _.cloneDeep(state);

    if (newState.batchItemCreationFormData.value.skipCreationForm)
        newState.itemCreationSetupData.mode = ItemCreationMode.BatchItemWithoutGUI;
    else
        newState.itemCreationSetupData.mode = ItemCreationMode.BatchItemWithGUI;


    newState.batchItemCreationRecords.currentIndex = newState.batchItemCreationRecords.proposedItems.findIndex(p => p.SELECTED);

    return newState;
}

export function continueBatchItemsCreation(state: State): State {
    console.log('paliky continue');
    const newState = _.cloneDeep(state);
    console.log(`before index ${newState.batchItemCreationRecords.currentIndex}`);
    newState.batchItemCreationRecords.currentIndex = newState.batchItemCreationRecords.proposedItems.findIndex(p => p.SELECTED);

    if (newState.batchItemCreationRecords.currentIndex < 0)
        newState.itemCreationSetupData.mode = ItemCreationMode.SingleItem;

    console.log(`after index ${newState.batchItemCreationRecords.currentIndex}`);
    return newState;
}

export function forceEndBatchItemCreation(state: State): State {
    const newState = _.cloneDeep(state);
    newState.batchItemCreationRecords.currentIndex = -1;
    newState.itemCreationSetupData.mode = ItemCreationMode.SingleItem;
    return newState;
}

export function setLinkToCurrentProposedItemAndUnselect(state: State, args: { redmineLink: string }): State {
    console.log('odelectowujemy');
    const newState: State = _.cloneDeep(state);
    const proposedItem = newState.batchItemCreationRecords.proposedItems[newState.batchItemCreationRecords.currentIndex];
    proposedItem.SELECTED = false;
    proposedItem.REDMINE_LINK = args.redmineLink;
    console.dir(proposedItem);
    return newState;
}

