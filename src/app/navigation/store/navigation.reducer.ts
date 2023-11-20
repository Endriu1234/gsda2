import { createFeatureSelector, createReducer, createSelector, on } from '@ngrx/store';
import { toggleSidenav, changeSidenavOpened, toggleMenuItem } from './navigation.actions';

export interface MenuItem {
    caption: string;
    route: string;
    icon: string;
    expanded?: boolean;
    childMenuItems?: MenuItem[];
}

export interface State {
    sidenavOpened: boolean;
    menuItems: MenuItem[];
}

const initialState: State = {
    sidenavOpened: false,
    menuItems: [
        {
            caption: 'Items',
            route: '/items',
            icon: 'description',
            expanded: false,
            childMenuItems: [
                {
                    caption: 'Item Creation',
                    route: '/items/itemcreation',
                    icon: 'note_add'
                },
                {
                    caption: 'Batch Items Creation',
                    route: '/items/batchitemscreation',
                    icon: 'file_copy'
                },
                {
                    caption: 'Item View/Edit',
                    route: '/items/itemviewedit',
                    icon: 'file_open'
                },
                {
                    caption: 'Items From E-mails',
                    route: '/items/itemsfromemails',
                    icon: 'mail'
                }
            ]
        },
        {
            caption: 'Projects',
            route: '/projects',
            icon: 'folder',
            expanded: false,
            childMenuItems: [
                {
                    caption: 'Project Creation',
                    route: '/projects/projectcreation',
                    icon: 'create_new_folder'
                },
                {
                    caption: 'Project View/Edit',
                    route: '/projects/projectviewedit',
                    icon: 'folder_open'
                },
                {
                    caption: 'Create/Upd Version',
                    route: '/projects/versioncreation',
                    'icon': 'snippet_folder'
                }
            ]
        },
        {
            caption: 'Daily Meeting',
            route: '/daily',
            icon: 'view_timeline'
        },
        {
            caption: 'Communication',
            route: '/communication',
            icon: 'share_reviews',
            expanded: false,
            childMenuItems: [
                {
                    caption: 'Chat',
                    route: '/communication/chat',
                    icon: 'auto_read_pause'
                },
                {
                    caption: 'Notifications',
                    route: '/communication/notifications',
                    icon: 'notifications'
                }
            ]
        },
        {
            caption: 'Other',
            route: '/other',
            icon: 'devices_other',
            expanded: false,
            childMenuItems: [
                {
                    caption: 'Find Support Guys',
                    route: '/other/findsupportguys',
                    icon: 'person_search'
                }
            ]
        },
        {
            caption: 'Setup',
            route: '/setup',
            icon: 'settings',
            expanded: false,
            childMenuItems: [
                {
                    caption: 'UI Preferences',
                    route: '/setup/uipreferences',
                    icon: 'display_settings'
                },
                {
                    caption: 'Cache',
                    route: '/setup/cache',
                    icon: 'cached'
                },
                {
                    caption: 'Privileges',
                    route: '/setup/privileges',
                    icon: 'security'
                }
            ]
        }
    ]
}

export const navigationReducerKey = 'navigation';
export const navigationReducer = createReducer(initialState,
    on(toggleSidenav, (state) => { return { ...state, sidenavOpened: !state.sidenavOpened } }),
    on(changeSidenavOpened, (state, { opened }) => { return { ...state, sidenavOpened: opened } }),
    on(toggleMenuItem, (state, { index }) => {
        const newState = { ...state };
        newState.menuItems[index].expanded = !newState.menuItems[index].expanded
        return newState;
    }));

export const getNavigationState = createFeatureSelector<State>(navigationReducerKey);
export const getSidenavOpened = createSelector(getNavigationState, (state: State) => state.sidenavOpened);
export const getMenuItems = createSelector(getNavigationState, (state: State) => state.menuItems);


