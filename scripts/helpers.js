function toggleGraph(event) {
    const clicked = event.currentTarget;
    const clickedID = (clicked.id).substring("graph-select-".length);
    const toggledVal = clicked.getAttribute('toggled');
    const isToggled = toggledVal === 'true';
    if (isToggled) {
        replayGraphAnimation(clickedID);
    } else {
        const btnContainer = (clicked.closest('#graph-select'));
        const allBtns = btnContainer.querySelectorAll('div[id^="graph-select-"]');
        allBtns.forEach(function(div) {
            div.classList.remove('graph-toggled');
            div.setAttribute('toggled', 'false');
        });
        clicked.classList.add('graph-toggled');
        clicked.setAttribute('toggled', 'true');
        const graphContainer = document.getElementById('graph-container');
        const allGraphs = graphContainer.querySelectorAll('div[id^="graph-"]');
        allGraphs.forEach(function(graph) {
            const graphID = (graph.id).substring("graph-".length);
            if (graphID === clickedID) {
                graph.classList.remove('collapse');
            } else {
                graph.classList.add('collapse');
            }
        });
        replayGraphAnimation(clickedID);
    }
}

function replayGraphAnimation(graphID) {
    const path = document.getElementById(`${graphID}-path`);
    if (graphID === '1') {
        if (!path) return;
        const length = path.getTotalLength();
        path.style.transition = 'none';
        path.style.strokeDasharray = `${length},${length}`;
        path.style.strokeDashoffset = length;
        path.getBoundingClientRect();
        path.style.transition = 'stroke-dashoffset 1s linear';
        path.style.strokeDashoffset = '0';
        const glowColors = ["#7b47f4", "#7b47f4", "#7b47f4", "#7b47f4"];
        glowColors.forEach((_, idx) => {
            const glowPath = document.getElementById(`${graphID}-glow-path-${idx}`);
            if (!glowPath) return;
            glowPath.style.transition = 'none';
            glowPath.style.strokeDasharray = `${length},${length}`;
            glowPath.style.strokeDashoffset = length;
            glowPath.getBoundingClientRect();
            glowPath.style.transition = 'stroke-dashoffset 1s linear, stroke-opacity 1s linear';
            glowPath.style.strokeDashoffset = '0';
            glowPath.style.strokeOpacity = '0.1';
        });
    } else if (graphID === '2') {
        const container = document.getElementById('graph-2-cont');
        const rects = container.querySelectorAll('rect');
        rects.forEach(rect => {
            const y = rect.getAttribute('data-y');
            const height = rect.getAttribute('data-height');
            rect.style.transition = 'none';
            rect.setAttribute('y', height - 120);
            rect.setAttribute('height', 0);
            rect.getBoundingClientRect();
            rect.style.transition = 'y 500ms linear, height 500ms linear';
            rect.setAttribute('y', y);
            rect.setAttribute('height', height);
        });
    }
}