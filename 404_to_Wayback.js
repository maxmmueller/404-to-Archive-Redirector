// ==UserScript==
// @name         404 to Archive Redirector
// @version      0.2
// @description  If you land on an unavailable page, this will redirect you to a stored version in the Wayback Machine.
// @author       Maximilian Müller
// @match        http://*/*
// @match        https://*/*
// @grant        none
// ==/UserScript==


(function () {
    'use strict';

    async function isPageUnavailable(url) {
        return fetch(url)
            .then(response => {
                return !response.ok && response.status === 404;
            })
            .catch(error => {
                return false;
            });
    }

    function redirectToWaybackMachine(url) {
        const waybackUrl = `https://archive.org/wayback/available?url=${url}`;

        fetch(waybackUrl)
            .then(response => response.json())
            .then(data => {
                const storedVersionAvailable = data && data.archived_snapshots && data.archived_snapshots.closest;
                if (storedVersionAvailable) {
                    const userConfirmed = confirm("This page appears to be unavailable. You are now being redirected to the Wayback Machine!");
                    if (userConfirmed) {
                        window.location.href = data.archived_snapshots.closest.url;
                    }
                }
            });
    }


    const activeUrl = window.location.href;

    isPageUnavailable(activeUrl)
        .then(is404 => {
            if (is404) {
                redirectToWaybackMachine(activeUrl);
            }
        });
})();