import * as _ from 'lodash';
import { State } from "../state/items.state";
import { filterRedmineProjects, filterRedmineUsersGroup, filterSoftDevProjects, filterTmsClientsGroup } from 'src/app/shared/store/shared.reducer-handlers';
import { ProposedItem } from '../models/batchitemcreation/proposed-item.model';
import { ItemCreationMode } from '../state/items.item-creation-state';
import { unbox } from 'ngrx-forms';
import { moveItemInArray } from '@angular/cdk/drag-drop';
import { TmsClient } from 'src/app/shared/store/models/tms-client.model';
import { TmsClientByLetter } from 'src/app/shared/store/models/tms-client-letter.model';
import { RedmineVersion } from '../../../shared/store/models/redmine-version.model';

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

export function setRedmineSourceProjectsFilterForBatchItemCreationCriteria(state: State): State {
    const newState: State = _.cloneDeep(state);
    newState.batchItemCreationRedmineCriteriaSetupData.redmineSourceProjectsFiltered
        = filterRedmineProjects(newState.itemsSetupData.redmineProjects, newState.batchItemCreationRedmineCriteriaFormData.value.sourceRedmineProject);
        newState.batchItemCreationRedmineCriteriaSetupData.redmineSourceProjectsFiltered 
        = newState.batchItemCreationRedmineCriteriaSetupData.redmineSourceProjectsFiltered.filter(u => u.name.toLocaleLowerCase() !== newState.batchItemCreationRedmineCriteriaFormData.value.targetRedmineProject.toLocaleLowerCase());
    return newState;
}

export function setRedmineTargetProjectsFilterForBatchItemCreationCriteria(state: State): State {
    const newState: State = _.cloneDeep(state);
    newState.batchItemCreationRedmineCriteriaSetupData.redmineTargetProjectsFiltered
        = filterRedmineProjects(newState.itemsSetupData.redmineProjects, newState.batchItemCreationRedmineCriteriaFormData.value.targetRedmineProject);
    newState.batchItemCreationRedmineCriteriaSetupData.redmineTargetProjectsFiltered 
        = newState.batchItemCreationRedmineCriteriaSetupData.redmineTargetProjectsFiltered.filter(u => u.name.toLocaleLowerCase() !== newState.batchItemCreationRedmineCriteriaFormData.value.sourceRedmineProject.toLocaleLowerCase());
    return newState;
}

export function setRedmineTargetProjectsFilterForTmsBatchItemCreationCriteria(state: State): State {
    const newState: State = _.cloneDeep(state);
    newState.batchItemCreationTMSCriteriaSetupData.redmineTargetProjectsFiltered
        = filterRedmineProjects(newState.itemsSetupData.redmineProjects, newState.batchItemCreationTMSCriteriaFormData.value.targetRedmineProject);
    return newState;
}

export function setRedmineUsersByLetterFilterForTmsBatchItemCreationCriteria(state: State): State {
    const newState: State = _.cloneDeep(state);
    newState.batchItemCreationTMSCriteriaSetupData.redmineUsersByLetterFiltered = filterRedmineUsersGroup(newState.batchItemCreationTMSCriteriaSetupData.redmineUsersByLetter, newState.batchItemCreationTMSCriteriaFormData.value.userToITms);
    return newState;
}

export function initTmsClients(state: State): State {
    const newState = _.cloneDeep(state);
    newState.batchItemCreationTMSCriteriaSetupData.tmsClientsLoaded = false;
    return newState;
}

export function loadTmsClients(state: State, args: { tmsClients: TmsClient[] }): State {
    const newState: State = _.cloneDeep(state);
    newState.batchItemCreationTMSCriteriaSetupData.tmsClients = args.tmsClients;
    newState.batchItemCreationTMSCriteriaSetupData.tmsClientsByLetter = createTmsClientsByLetter(newState.batchItemCreationTMSCriteriaSetupData.tmsClients);
    newState.batchItemCreationTMSCriteriaSetupData.tmsClientsByLetterFiltered = filterTmsClientsGroup(newState.batchItemCreationTMSCriteriaSetupData.tmsClientsByLetter, newState.batchItemCreationTMSCriteriaFormData.value.iTMSClient);
    newState.batchItemCreationTMSCriteriaSetupData.tmsClientsLoaded = true;
    return newState;
}

function createTmsClientsByLetter(allClients: TmsClient[]): TmsClientByLetter[] {
    let clientsByLetter: TmsClientByLetter[] = [];
    let letter = '';
    let clientsTmp: TmsClient[] = [];

    if (allClients) {
        allClients.forEach(element => {
            if (element.TMS_CLIENT[0] !== letter) {
                if (letter !== '') {
                    clientsByLetter.push({ letter: letter, tmsClients: clientsTmp.slice() });
                }
                letter = element.TMS_CLIENT[0];
                clientsTmp.length = 0;
            }
            clientsTmp.push(element);
        });
        if (letter !== '') {
            clientsByLetter.push({ letter: letter, tmsClients: clientsTmp.slice() });
        }
    }

    return clientsByLetter;
}

export function setTmsClientsByLetterFilter(state: State): State {
    const newState: State = _.cloneDeep(state);
    newState.batchItemCreationTMSCriteriaSetupData.tmsClientsByLetterFiltered = filterTmsClientsGroup(newState.batchItemCreationTMSCriteriaSetupData.tmsClientsByLetter, newState.batchItemCreationTMSCriteriaFormData.value.iTMSClient);
    return newState;
}

export function setRedmineTargetProjectsFilterForIdsBatchItemCreationCriteria(state: State): State {
    const newState: State = _.cloneDeep(state);
    newState.batchItemCreationIdsCriteriaSetupData.redmineTargetProjectsFiltered
        = filterRedmineProjects(newState.itemsSetupData.redmineProjects, newState.batchItemCreationIdsCriteriaFormData.value.targetRedmineProject);
    return newState;
}

export function initRedmineVersionsForIds(state: State): State {
    const newState = _.cloneDeep(state);
    newState.batchItemCreationIdsCriteriaSetupData.redmineVersionsLoaded = false;
    return newState;
}

export function loadRedmineVersionsForIds(state: State, args: { redmineVersions: RedmineVersion[] }): State {
    const newState: State = _.cloneDeep(state);
    newState.batchItemCreationIdsCriteriaSetupData.redmineVersions = args.redmineVersions;
    newState.batchItemCreationIdsCriteriaSetupData.redmineVersionsLoaded = true;
    return newState;
}

export function clearRedmineVersionsForIds(state: State): State {
    const newState: State = _.cloneDeep(state);
    newState.batchItemCreationIdsCriteriaSetupData.redmineVersions = [];
    newState.batchItemCreationIdsCriteriaSetupData.redmineVersionsLoaded = false;
    return newState;
}

export function initRedmineVersionsForTms(state: State): State {
    const newState = _.cloneDeep(state);
    newState.batchItemCreationTMSCriteriaSetupData.redmineVersionsLoaded = false;
    return newState;
}

export function loadRedmineVersionsForTms(state: State, args: { redmineVersions: RedmineVersion[] }): State {
    const newState: State = _.cloneDeep(state);
    newState.batchItemCreationTMSCriteriaSetupData.redmineVersions = args.redmineVersions;
    newState.batchItemCreationTMSCriteriaSetupData.redmineVersionsLoaded = true;
    return newState;
}

export function clearRedmineVersionsForTms(state: State): State {
    const newState: State = _.cloneDeep(state);
    newState.batchItemCreationTMSCriteriaSetupData.redmineVersions = [];
    newState.batchItemCreationTMSCriteriaSetupData.redmineVersionsLoaded = false;
    return newState;
}

export function initRedmineVersionsForRedmine(state: State): State {
    const newState = _.cloneDeep(state);
    newState.batchItemCreationRedmineCriteriaSetupData.redmineVersionsLoaded = false;
    return newState;
}

export function loadRedmineVersionsForRedmine(state: State, args: { redmineVersions: RedmineVersion[] }): State {
    const newState: State = _.cloneDeep(state);
    newState.batchItemCreationRedmineCriteriaSetupData.redmineVersions = args.redmineVersions;
    newState.batchItemCreationRedmineCriteriaSetupData.redmineVersionsLoaded = true;
    return newState;
}

export function clearRedmineVersionsForRedmine(state: State): State {
    const newState: State = _.cloneDeep(state);
    newState.batchItemCreationRedmineCriteriaSetupData.redmineVersions = [];
    newState.batchItemCreationRedmineCriteriaSetupData.redmineVersionsLoaded = false;
    return newState;
}

export function initRedmineVersionsForSd(state: State): State {
    const newState = _.cloneDeep(state);
    newState.batchItemCreationSdCriteriaSetupData.redmineVersionsLoaded = false;
    return newState;
}

export function loadRedmineVersionsForSd(state: State, args: { redmineVersions: RedmineVersion[] }): State {
    const newState: State = _.cloneDeep(state);
    newState.batchItemCreationSdCriteriaSetupData.redmineVersions = args.redmineVersions;
    newState.batchItemCreationSdCriteriaSetupData.redmineVersionsLoaded = true;
    return newState;
}

export function clearRedmineVersionsForSd(state: State): State {
    const newState: State = _.cloneDeep(state);
    newState.batchItemCreationSdCriteriaSetupData.redmineVersions = [];
    newState.batchItemCreationSdCriteriaSetupData.redmineVersionsLoaded = false;
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

export function forceEndBatchItemCreation(state: State, args: {withRedirection: boolean}): State {
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

export function setBatchItemCreationTabIndex(state: State, args: { index: number }): State {
    const newState: State = _.cloneDeep(state);
    newState.batchItemCreation.activated_tab = args.index;
    return newState;
}

export function setBatchItemCreationSelectedTabIndex(state: State, args: { index: number }): State {
    const newState: State = _.cloneDeep(state);
    newState.batchItemCreation.selected_tab = args.index;
    return newState;
}

