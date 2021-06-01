/* eslint-disable react/no-multi-comp */
/* ******************************************************************************
 * index.jsx                                                                    *
 * *************************************************************************/ /**
 *
 * @fileoverview Setup/initialization of the Riff react SPA
 *
 * Created on       August 7, 2017
 * @author          Jordan Reedie
 * @author          Dan Calacci
 *
 * @copyright (c) 2017 Riff Learning,
 *            See LICENSE.txt for license information.
 *
 * ******************************************************************************/

// import 'webrtc-adapter'; // see https://bloggeek.me/webrtc-adapter-js/ for what this does.

// TODO: WHY? If this isn't here, video chat crashes when someone joins!
//       And yet as far as I can tell this package is only supposed to be used
//       for development. -mjl 2018-10-15
// import 'react-hot-loader';

// import 'sass/main.scss';

import { Dashboard } from '@rifflearning/riff-metrics';
import React, { useEffect } from 'react';

const DashboardPage = () => {
    useEffect(() => {
        const $style = document.createElement('style');

        document.head.appendChild($style);
        $style.innerHTML = `
            body, html {
                height: auto;
            }
            `;

        return () => {
            $style.parentNode.removeChild($style);
        };
    }, []);

    return (<div id = 'riff-dashboard-page-full'>
        <div id = 'main-content-container'>
            <Dashboard />
        </div>
    </div>);
};

export default () =>
    <DashboardPage />
;

