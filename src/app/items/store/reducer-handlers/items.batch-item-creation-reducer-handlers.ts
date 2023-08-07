import * as _ from 'lodash';
import { State } from "../state/items.state";
import { filterRedmineProjects, filterSoftDevProjects } from 'src/app/shared/store/shared.reducer-handlers';
import { ProposedItem } from '../models/batchitemcreation/proposed-item.model';
import { ItemCreationMode } from '../state/items.item-creation-state';
import { unbox } from 'ngrx-forms';
import { moveItemInArray } from '@angular/cdk/drag-drop';

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
    const newState = _.cloneDeep(state);
    newState.batchItemCreationRecords.currentIndex = newState.batchItemCreationRecords.proposedItems.findIndex(p => p.SELECTED);

    if (newState.batchItemCreationRecords.currentIndex < 0)
        newState.itemCreationSetupData.mode = ItemCreationMode.SingleItem;

    return newState;
}

export function forceEndBatchItemCreation(state: State): State {
    const newState = _.cloneDeep(state);
    newState.batchItemCreationRecords.currentIndex = -1;
    newState.itemCreationSetupData.mode = ItemCreationMode.SingleItem;
    return newState;
}

export function setLinkToCurrentProposedItemAndUnselect(state: State, args: { redmineLink: string }): State {
    const newState: State = _.cloneDeep(state);
    const proposedItem = newState.batchItemCreationRecords.proposedItems[newState.batchItemCreationRecords.currentIndex];
    proposedItem.SELECTED = false;
    proposedItem.REDMINE_LINK = args.redmineLink;
    return newState;
}

export function createOneRecordFromBatch(state: State, args: {proposedItem: ProposedItem}): State {
    const newState = _.cloneDeep(state);
    const index = state.batchItemCreationRecords.proposedItems.findIndex(i => {
        return i.SUBJECT === args.proposedItem.SUBJECT
            && i.DESCRIPTION === args.proposedItem.DESCRIPTION
            && i.ISSUE === args.proposedItem.ISSUE
            && i.CR === args.proposedItem.CR
            && i.TMS === args.proposedItem.TMS
            && i.ASSIGNEE === args.proposedItem.ASSIGNEE
            && i.TRACKER === args.proposedItem.TRACKER;
    });

    newState.itemCreationSetupData.mode = ItemCreationMode.BatchItemSingleRecord;
    newState.batchItemCreationRecords.currentIndex = index;

    return newState;
}

export function updateBatchItemCreationFormColumn(state: State): State {
    const newState: State = _.cloneDeep(state);
    
    for (let index = 0; index < unbox(newState.batchItemCreationFormData.value.visibleColumns).length; index++) {
        let column = unbox(newState.batchItemCreationFormData.value.visibleColumns)[index];
        
        if (newState.batchItemCreationFormDataAddon.value.displayedColumns.indexOf(column) < 0) {
            const dispLenght = newState.batchItemCreationFormDataAddon.value.displayedColumns.length;
            const removableLength = state.batchItemCreationGridRemovableColumns.length;
            newState.batchItemCreationFormDataAddon.value.displayedColumns.splice((dispLenght - removableLength)+1, 0, column);
            moveItemInArray(newState.batchItemCreationFormDataAddon.value.displayedColumns, (dispLenght - removableLength)+1, dispLenght-2);
        }
    }

    newState.batchItemCreationFormDataAddon.value.displayedColumns.map((column) => {
        if (state.batchItemCreationGridRemovableColumns.includes(column)) {
            if (unbox(newState.batchItemCreationFormData.value.visibleColumns).indexOf(column) < 0) {
                newState.batchItemCreationFormDataAddon.value.displayedColumns = newState.batchItemCreationFormDataAddon.value.displayedColumns.filter(colName => colName !== column)
            }
        }
    });
    
    
    return newState;
}

export function dragAndDropBatchItemsCreationColumns(state: State, args: { prevIndex: number, currIndex: number }): State {
    const newState: State = _.cloneDeep(state);
    moveItemInArray(newState.batchItemCreationFormDataAddon.value.displayedColumns, args.prevIndex, args.currIndex);
    return newState;
}

