// @flow

import React from 'react';

import { translate } from '../../../base/i18n';
import { Icon, IconInviteMore } from '../../../base/icons';
import { getParticipantCount } from '../../../base/participants';
import { connect } from '../../../base/redux';
import { beginAddPeople } from '../../../invite';
import MultipleRoomsNameDropdown from '../../../riff-platform/components/Meeting/MultipleRoomsMeetingNameDropdown';
// HEAD
// import {
//     isButtonEnabled,
//     isToolboxVisible
// } from '../../../toolbox';

import { isButtonEnabled, isToolboxVisible } from '../../../toolbox/functions.web';

declare var interfaceConfig: Object;

type Props = {

    /**
     * Whether to show the option to invite more people.
     */
    _shouldShow: boolean,

    /**
     * Whether the toolbox is visible.
     */
    _toolboxVisible: boolean,

    /**
     * Handler to open the invite dialog.
     */
    onClick: Function,

    /**
     * Invoked to obtain translated strings.
     */
    t: Function,

    /**
     * Whether to show name with multiple rooms quantity instead of name.
     */
    _isMultipleRoomsQuantity: boolean
}

/**
 * Represents a replacement for the subject, prompting the
 * sole participant to invite more participants.
 *
 * @param {Object} props - The props of the component.
 * @returns {React$Element<any>}
 */
function InviteMore({
    _isMultipleRoomsQuantity,
    _shouldShow,
    _toolboxVisible,

    onClick,
    t
}: Props) {

    return (
        _shouldShow
            ? <div className = { `invite-more-container${_toolboxVisible ? '' : ' elevated'}` }>
                <div className = 'invite-more-content'>
                    <div className = 'invite-more-header'>
                        {t('addPeople.inviteMoreHeader')}
                    </div>
                    <div
                        className = 'invite-more-button'
                        onClick = { onClick }>
                        <Icon src = { IconInviteMore } />
                        <div className = 'invite-more-button-text'>
                            {t('addPeople.inviteMorePrompt')}
                            {_isMultipleRoomsQuantity ? <MultipleRoomsNameDropdown /> : null }
                        </div>
                    </div>
                </div>
            </div> : null
    );
}

/**
 * Maps (parts of) the Redux state to the associated
 * {@code Subject}'s props.
 *
 * @param {Object} state - The Redux state.
 * @private
 * @returns {Props}
 */
function mapStateToProps(state) {
    const participantCount = getParticipantCount(state);
    const isAlone = participantCount === 1;
    const hide = interfaceConfig.HIDE_INVITE_MORE_HEADER;

    return {
// HEAD
        //_tileViewEnabled: state['features/video-layout'].tileViewEnabled,
        //_visible: isToolboxVisible(state) && isButtonEnabled('invite') && isAlone && !hide,
        _isMultipleRoomsQuantity: Boolean(state['features/riff-platform']?.meeting?.meeting?.multipleRoomsQuantity),

        _shouldShow: isButtonEnabled('invite', state) && isAlone && !hide,
        _toolboxVisible: isToolboxVisible(state)
    };
}

/**
 * Maps dispatching of some action to React component props.
 *
 * @param {Function} dispatch - Redux action dispatcher.
 * @returns {Props}
 */
const mapDispatchToProps = {
    onClick: () => beginAddPeople()
};

export default translate(connect(mapStateToProps, mapDispatchToProps)(InviteMore));
