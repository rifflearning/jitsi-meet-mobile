/* eslint-disable require-jsdoc */
import React from 'react';
import { Modal, ModalBody, ModalHeader, Button } from 'reactstrap';
import RecordRTC from 'recordrtc';

const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

export default class ScreenRecordPreviewModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoaded: false
        };
    }

    // Download option for screen record
    downloadScreenRecordVideo = () => {
        const recorderBlob = this.props.recorder;

        if (!recorderBlob) {
            return;
        }
        if (isSafari) {
            if (recorderBlob && recorderBlob.getDataURL) {
                recorderBlob.getDataURL(function(dataURL) {
                    RecordRTC.SaveToDisk(dataURL, this.getFileName('mp4'));
                });

                return;
            }
        }
        if (recorderBlob) {
            const blob = recorderBlob;
            const file = new File([ blob ], this.getFileName('mp4'), {
                type: 'video/mp4'
            });

            RecordRTC.invokeSaveAsDialog(file);
        }
    };

    // Get file name
    getFileName = fileExtension => {
        const d = new Date();
        const year = d.getFullYear();
        const month = d.getMonth();
        const date = d.getDate();

        return `ScreenRecord-${year}${month}${date}-${this.getRandomString()}.${fileExtension}`;
    }

    // Get random string for file name
    getRandomString = () => {
        if (window.crypto && window.crypto.getRandomValues && navigator.userAgent.indexOf('Safari') === -1) {
            let a = window.crypto.getRandomValues(new Uint32Array(3)),
                token = '';

            for (let i = 0, l = a.length; i < l; i++) {
                token += a[i].toString(36);
            }

            return token;
        }

        return (Math.random() * new Date().getTime()).toString(36).replace(/\./g, '');

    }
    render() {
        return (
            <Modal isOpen = { this.props.isOpenVideoModal } >
                <ModalHeader
                    className = 'video__modal__header'
                    toggle = { this.props.videoModalClose } >
                    <button
                        className = 'lnr lnr-cross video__modal__clsBtn formModalCloseButton'
                        type = 'button'
                        onClick = { this.props.videoModalClose } />
                    <span className = 'bold-text'>Preview Screen Record</span >
                </ModalHeader >
                <ModalBody >
                    <div className = 'downloadButtonAlign' >
                        <Button
                            color = 'primary'
                            outline = { true }
                            onClick = { this.downloadScreenRecordVideo } >Download</Button >
                    </div >
                    <video
                        id = 'videorecord'
                        controls = { true }

                        // controlsList="nodownload"
                        autoPlay = { this.state.isLoaded }
                        playsInline = { true }
                        width = { '100%' }
                        height = { '100%' }
                        src = { this.props.recordedVideoUrl } />
                </ModalBody >
            </Modal >
        );
    }
}
