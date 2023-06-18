function processNodes(nodesToTransform) {
    console.log("Robold is processing web page text")
    if (nodesToTransform.length === 0) {
        return;
    }

    var node = nodesToTransform.shift();
    // Split the text into words and special characters
    var wordsAndSpecialChars = node.nodeValue.split(/(\W+)/);
    var newText = '';
    for (var i = 0; i < wordsAndSpecialChars.length; i++) {
        // Check if the "word" is actually a word (i.e., it consists only of alphanumeric characters)
        if (/^\w+$/.test(wordsAndSpecialChars[i])) {
            // Calculate how many characters to bold.
            var numCharsToBold = Math.max(1, Math.ceil(wordsAndSpecialChars[i].length * 0.33));
            // Create new word with first numCharsToBold characters in bold
            wordsAndSpecialChars[i] = '<b>' + wordsAndSpecialChars[i].slice(0, numCharsToBold) + '</b>' + wordsAndSpecialChars[i].slice(numCharsToBold);
        }
        // Append the "word" or special character to the new text
        newText += wordsAndSpecialChars[i];
    }

    var fragment = document.createRange().createContextualFragment(newText);

    if(node.parentNode) {
        node.parentNode.replaceChild(fragment, node);
    }

    if ('requestIdleCallback' in window) {
        requestIdleCallback(function() {
            processNodes(nodesToTransform);
        });
    } else {
        setTimeout(function() {
            processNodes(nodesToTransform);
        }, 0);
    }
}



function processText() {
    console.log("Robold is processing text")

    var walker = document.createTreeWalker(
        document.body,
        NodeFilter.SHOW_TEXT,
        {
            acceptNode: function(node) {
                if (
                    node.parentNode.nodeName === 'SCRIPT' ||
                    node.parentNode.nodeName === 'STYLE' ||
                    node.parentNode.nodeName === 'A' ||
                    node.parentNode.nodeName === 'TEXTAREA' ||
                    node.parentNode.nodeName === 'BUTTON' ||
                    node.parentNode.nodeName === 'OPTION'
                ) {
                    return NodeFilter.FILTER_REJECT;
                }

                var wordCount = (node.nodeValue.match(/\b\w+\b/g) || []).length;
                if (wordCount > 5) {
                    return NodeFilter.FILTER_ACCEPT;
                }
            },
        },
        false
    );

    var nodesToTransform = [];
    var node;
    while ((node = walker.nextNode())) {
        nodesToTransform.push({
            node: node,
            distance: Math.abs(window.scrollY - node.parentNode.getBoundingClientRect().top),
        });
    }

    nodesToTransform.sort(function(a, b) {
        return a.distance - b.distance;
    });

    processNodes(nodesToTransform.map(function(item) {
        return item.node;
    }));
}

// Run the processing when the page is idle.
if ('requestIdleCallback' in window) {
    requestIdleCallback(processText);
} else {
    setTimeout(processText, 0);
}

// Run the processing when the page loads.
window.addEventListener('load', processText);

