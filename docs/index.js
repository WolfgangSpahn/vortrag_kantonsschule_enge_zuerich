(function () {
    'use strict';

    // Base URL of the backend API, replace with your actual AWS API Gateway or server endpoint
    const BASE_URL = 'https://sebayt.ch/interaktiv/';  // AWS endpoint

    /**
     * Asynchronously performs an HTTP request using the Fetch API with the specified method and options.
     * 
     * @param {string} url                    - The URL to which the request is sent. Can be absolute or relative.
     * @param {string} method                 - The HTTP method to be used for the request (e.g., 'GET', 'POST', 'PUT', 'PATCH').
     * @param {Object|null} [data=null]       - Optional. The data to be sent as the request body, used for methods like POST, PUT, and PATCH. If not provided, it defaults to null.
     * @param {Function|null} [callback=null] - Optional. A legacy callback function that is invoked with the response data, if provided. Defaults to null.
     * 
     * @returns {Promise<Object|null>}        - Returns a promise that resolves to the JSON-parsed response if the request is successful, or `null` if there is an error or the response is not OK.
     * 
     * @description
     * The function starts by constructing the `fetchOptions` object, which includes the HTTP method and headers.
     * If the request method is one of 'POST', 'PUT', or 'PATCH' and data is provided, it adds a 'Content-Type' header
     * and serializes the data to JSON, attaching it as the request body.
     * 
     * The function ensures the URL is absolute. If it is a relative URL, it appends it to the `BASE_URL`.
     * 
     * It then performs the fetch using the Fetch API and processes the response:
     * 1. If the response is not OK (status code not in the 2xx range), it logs the error and returns `null`.
     * 2. If the response is OK, it parses the JSON response.
     * 3. If a callback is provided, it is invoked with the parsed JSON response.
     * 4. The parsed JSON response is returned.
     * 
     * If an error occurs during the fetch (network issue, invalid URL, etc.), the function logs the error and returns `null`.
     */
    async function doFetch(url, method, data = null, /* legacy */ callback = null) {
        console.log('====> doFetch', url, method, data);
        const fetchOptions = {
            method: method,
            headers: {}
            //credentials: 'include'  // Include credentials like cookies if needed
        };

        // Only attach the body for methods that typically use a body payload
        if (data !== null && ['POST', 'PUT', 'PATCH'].includes(method.toUpperCase())) {
            fetchOptions.headers['Content-Type'] = 'application/json';
            fetchOptions.body = JSON.stringify(data);
        }

        // Ensure URL is absolute, append to BASE_URL if it's relative
        const fetchUrl = url.startsWith('http') ? url : `${BASE_URL}${url}`;
        console.log(`fetching: ${fetchUrl}`);

        try {
            const response = await fetch(fetchUrl, fetchOptions);
            if (!response.ok) {
                const errorText = await response.text();
                console.error(`Error: ${response.status} - ${response.statusText}`, errorText);
                return null;
            }

            const jsonResponse = await response.json();
            if (callback) {
                callback(jsonResponse);
            }
            return jsonResponse;
        } catch (error) {
            console.error('Error during fetch:', error);
            return null;
        }
    }


    /**
     * Asynchronously fetches IP socket information from the server and logs the response.
     * 
     * @returns {Promise<Object|null>} - Returns a promise that resolves to the fetched IP socket information 
     * as an object if the request is successful, or `null` if there is an error or the response is not OK.
     * 
     * @description
     * This function uses the `doFetch` function to send a 'GET' request to the server endpoint `'ipsocket'`.
     * 
     * - It fetches the IP socket information from the server.
     * - The response is logged to the console.
     * - The function then returns the response object.
     * 
     * If the fetch fails or the response is not successful, `doFetch` returns `null`, which is propagated by this function.
     * 
     * @example
     * // Example usage:
     * const ipSocketInfo = await getIPSocket();
     * console.log(ipSocketInfo);
     * 
     * // Expected behavior:
     * // The function will log the response received from the server and return it. If the response contains IP socket data,
     * // it will be logged and returned as an object; otherwise, `null` will be returned.
     */
    async function getIPSocket() {
        console.log('====> getIPSocket');
        let response = await doFetch('ipsocket',"GET");
        console.log(response);
        return response;
    }


    /**
     * Asynchronously fetches and returns the Likert scale percentage for a given ID.
     * 
     * @param {string|number} id - The unique identifier used to fetch the specific Likert scale data from the server.
     * 
     * @returns {Promise<number|null>} - Returns a promise that resolves to the Likert scale percentage if found,
     * or `null` if the data is not available or there is an error.
     * 
     * @description
     * This function sends a 'GET' request to the `likert/{id}` endpoint using the `doFetch` function to retrieve Likert scale data.
     * 
     * - The function logs the request URL being fetched for debugging purposes.
     * - If a valid response containing the `likert` field is received, it returns the Likert percentage.
     * - If the `likert` field is not present in the response, the function logs an error message indicating that no Likert data was found for the given ID and returns `null`.
     * 
     * If an error occurs during the fetch, or if the response does not contain valid Likert data, `null` is returned.
     * 
     * @example
     * // Example usage:
     * const percentage = await likertPercentage(123);
     * console.log(percentage);  // Expected output: Likert scale percentage or null
     * 
     * // Expected behavior:
     * // If the server response is { likert: 85 }, the function returns 85.
     * // If the response does not contain a 'likert' field, the function logs an error and returns null.
     */
    async function likertPercentage(id){
        console.log('====> likertPercentage', id);
        console.log(`get likert/${id}`);
        let response = await doFetch(`likert/${id}`,"GET");
        console.log(response);
        if ('likert' in response)
            return response['likert'];
        else
            console.log(`no likert found for ${id} ${response}`);
            return null;
    }


    /**
     * Asynchronously fetches and returns the nickname for a given ID.
     * 
     * @param {string|number} id - The unique identifier used to fetch the specific nickname data from the server.
     * 
     * @returns {Promise<string|null>} - Returns a promise that resolves to the nickname if found, 
     * or `null` if the nickname is not available or there is an error.
     * 
     * @description
     * This function sends a 'GET' request to the `nickname/{id}` endpoint using the `doFetch` function to retrieve the nickname associated with the provided ID.
     * 
     * - The function logs the URL being fetched for debugging purposes.
     * - If a valid response containing the `nickname` field is received, it returns the nickname string.
     * - If the `nickname` field is not present in the response, the function logs an error message indicating that no nickname was found for the given ID and returns `null`.
     * 
     * If an error occurs during the fetch, or if the response does not contain valid nickname data, `null` is returned.
     * 
     * @example
     * // Example usage:
     * const nickname = await getNickname(456);
     * console.log(nickname);  // Expected output: Nickname string or null
     * 
     * // Expected behavior:
     * // If the server response is { nickname: "Johnny" }, the function returns "Johnny".
     * // If the response does not contain a 'nickname' field, the function logs an error and returns null.
     */
    async function getNickname(id){
        console.log('====> getNickname', id);
        console.log(`get nickname/${id}`);

        let response = await doFetch(`nickname/${id}`,"GET");
        console.log(response);
        if ('nickname' in response)
            return response['nickname'];
        else
            console.log(`no nickname found for ${id} ${response}`);
            return "-";
    }

    /**
     * Asynchronously sets a new nickname for a given user ID by sending a POST request to the server.
     * 
     * @param {string} nickname - The new nickname to be assigned to the user.
     * @param {string|number} id - The unique identifier (UUID) of the user for whom the nickname is being set.
     * 
     * @returns {Promise<Object|null>} - Returns a promise that resolves to the server response if the status is 'success', 
     * or `null` if there is an error or if the response does not indicate success.
     * 
     * @description
     * This function sends a 'POST' request to the `nickname` endpoint to set a new nickname for the user.
     * 
     * - The function logs the nickname and user ID for debugging purposes.
     * - It constructs the request payload as an object with two properties: `"user"` for the nickname and `"uuid"` for the user ID.
     * - The `doFetch` function is used to send the request with the `POST` method, including the payload data.
     * - If the response contains a `status` field with the value `'success'`, the function returns the entire response object.
     * - If the response does not contain a `status` field or the status is not `'success'`, an error is logged, and `null` is returned.
     * 
     * In case of an error or an unsuccessful response, `null` is returned.
     * 
     * @example
     * // Example usage:
     * const result = await setNickname('Johnny', 456);
     * console.log(result);  // Expected output: Server response with status 'success' or null
     * 
     * // Expected behavior:
     * // If the server response is { status: "success", message: "Nickname updated" }, the function returns the response.
     * // If the response does not indicate success, the function logs an error and returns null.
     */
    async function setNickname(nickname,id){
        console.log('====> setNickname', id, nickname);
        console.log(`set nickname: ${id} - ${nickname}`);

        let data = {"user":nickname, "uuid":id};
        let response = await doFetch(`nickname`,"POST",data);
        console.log(+response);
        if ('status' in response && response['status'] == 'success')
            return response;
        else
            console.log(`no status found ${response}`);
            return null;
    }

    /**
     * Asynchronously fetches a list of nicknames from the server.
     * 
     * @returns {Promise<Array>} - Returns a promise that resolves to an array of nicknames if found, 
     * or an empty array if there is no data or an error occurs.
     * 
     * @description
     * This function sends a 'GET' request to the `nicknames` endpoint using the `doFetch` function to retrieve a list of nicknames.
     * 
     * - The function logs the request to the console for debugging purposes.
     * - If the response contains a `nicknames` field, the function returns the list of nicknames (assumed to be an array).
     * - If the `nicknames` field is not found in the response, it logs an error and returns an empty array.
     * 
     * In case of an error or an unexpected response, the function safely returns an empty array to avoid further issues.
     * 
     * @example
     * // Example usage:
     * const nicknames = await getNicknames();
     * console.log(nicknames);  // Expected output: An array of nicknames or an empty array if no data is available
     * 
     * // Expected behavior:
     * // If the server response is { nicknames: ["Johnny", "Jane", "Bob"] }, the function returns the array ["Johnny", "Jane", "Bob"].
     * // If the response does not contain a 'nicknames' field, the function logs an error and returns an empty array.
     */
    async function getNicknames(){
        console.log('====> getNicknames');
        console.log(`get nicknames`);
        let response = await doFetch(`nicknames`,"GET");
        console.log(response);
        if ('nicknames' in response)
            return response['nicknames'];
        else
            console.log(`no nicknames found ${response}`);
            return [];
    }

    // src/draw.js

    // button to toggle visibility of the svg element

    function getSVG(element, argConfig) {
        const defaults = { width: 1050, height: 600 };
        const config = { ...defaults, ...argConfig };
        return SVG().size('100%', '100%').addTo(element).size(config.width, config.height);

    }

    ///////////////////////////////////////////// HTML DRAWING FUNCTIONS ///////////////////////////////////////

    function createHTMLButton(text, id, argConfig) {
        const defaults = {class: 'button', callback: () => console.log('Button clicked') };
        const config = { ...defaults, ...argConfig };
        const button = document.createElement('button');
        button.setAttribute('id', id);
        button.setAttribute('class', config.class);
        button.textContent = text;
        button.addEventListener('click', config.callback);
        return button;
    }

    ///////////////////////////////////////////// SVG DRAWING FUNCTIONS ///////////////////////////////////////


    function origin(draw, x, y, argConfig) {
        // radius = 5, fillColor = 'red'
        const defaults = {radius: 5, fillColor: 'red'};
        const config = { ...defaults, ...argConfig };
        // Add a circle to the SVG drawing at the specified position
        draw.circle(config.radius * 2)  // The diameter is twice the radius
            .fill(config.fillColor)     // Set the fill color
            .center(x, y);       // Position the center of the circle at (x, y)
    }

    function createSVGText(text, x, y, argConfig)  {
        const defaults = { anchor: 'left', size: 18, color: 'black' };
        const config = { ...defaults, ...argConfig };
        const textElement = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        textElement.setAttribute('x', x);
        textElement.setAttribute('y', y);
        textElement.setAttribute('fill', config.color);
        textElement.setAttribute('font-family', 'Arial');
        textElement.setAttribute('font-size', config.size);
        textElement.setAttribute('text-anchor', config.anchor);  // Centers text horizontally
        textElement.setAttribute('dominant-baseline', 'text-before-edge');  // Aligns text top to y coordinate
        if (config.hidden) {
            textElement.setAttribute('visibility', 'hidden');  // Hides the element if hidden is true
        }
        textElement.textContent = text;
        return textElement;
    }

    function rectWithText(draw, x, y, width, height, textFn, argConfig) {
        console.log('====> rectWithText', draw, x, y, width, height, textFn, argConfig);
        // Default configuration rx="2px", ry="2px",  textStroke ="white", fill = "gray", stroke = "black", strokeWidth = 1
        const defaults = { rx: 5, ry: 5, fontSize: 14, textStroke: 'white', rectFill: 'black', rectStroke: 'black', rectStrokeWidth: 1, 
                           callback: () => {console.log(`rectWithText "${textFn()}" clicked`);},
                           args: [] 
                         };
        const config = { ...defaults, ...argConfig };
        // Create a group and transform it to the specified x and y coordinates
        let group = draw.group().translate(x, y);

        // Add a rectangle to the group
        group.rect(width, height)
             .radius(config.rx, config.ry)           // Set the rounded corners
             .fill(config.rectFill)               // Set the fill color
             .addClass('clickable')
             .stroke({ width: config.rectStrokeWidth, color: config.rectStroke });  // Set the stroke width and color

        // Add text to the group, centered in the middle of the rectangle
        let text = group.text(textFn())
             .font({ anchor: 'middle', fill: config.textStroke, size: config.fontSize })  // Center the text horizontally and set the text color
             .addClass('clickable')
             .center(width / 2, height / 2);            // Move the text to the center of the rectangle

        // If a callback function is provided, add it to the group
        if (config.callback) {
            group.click(() => config.callback(text,...config.args));
        }
    }

    function estimateTextWidth(draw, text, fontFamily, fontSize) {
        console.log('====> estimateTextWidth', text, fontFamily, fontSize);
        // Average width of a character relative to the font size
        const averageCharWidthFactor = 0.5; // Adjust this factor as needed

        // Estimate the text width
        const estimatedWidth = text.length * fontSize * averageCharWidthFactor;

        console.log('estimateTextWidth:', text, fontSize, estimatedWidth);
        return estimatedWidth;
    }

    ///////////////////////////////////////////// BOARD FUNCTIONS ///////////////////////////////////////

    function postIt(draw, text, x, y, maxWidth=100, lineHeight=18, maxHeight=50) {
        console.log('====> postIt', draw, text, x, y, maxWidth, lineHeight, maxHeight);
        console.log('postIt:', text, x, y, maxWidth, lineHeight, maxHeight);
        const words = text.split(" ");
        console.log('- words:', words);
        let leftMargin = lineHeight/2;
        let topMargin = lineHeight/8;
        let size = lineHeight;
        let lineX = x + leftMargin;
        let lineY = y + topMargin;
        maxWidth = maxWidth - leftMargin;

        // holds the lines of text and x, y coordinates
        let lines = [];
        let line = '';
        let height = topMargin*3;
        words.forEach(function(word) {
            console.log('- - word:', word);
            const testLine = line + word + ' ';
            // get the width of the text without rendering it
            const testWidth = estimateTextWidth(draw, testLine, 'Arial', size);
            console.log("- - - ",testWidth, testLine, line, height, maxWidth);
            // If the line is too long, wrap the text
            if (testWidth > maxWidth) {
                lines.push({text: line});
                line = word + ' ';
                height += lineHeight*1.1;
            } else {
                line = testLine;
            }
            // draw.text(line).move(x+leftMargin, y + (lineNumber * lineHeight)).font({ family: 'Arial', size: size });
        });
        lines.push({text: line});
        height += lineHeight;
        // Create a group for the post-it note
        const group = draw.group();
        if (height < maxHeight) {
            height = maxHeight;
        }
        group.rect(120, height).attr({ fill: '#f9f79c', stroke: '#333', 'stroke-width': 2 }).move(x, y);
        // console.log({lines});
        lines.forEach(function(line) {
            const textElement = createSVGText(line.text, lineX, lineY, {anchor: 'left', size: 14, color: 'black'});
            group.node.appendChild(textElement);
            lineY = lineY + lineHeight;
            // group.text(line.text).move(line.x, line.y).font({ family: 'Arial', size: size }).attr('dominant-baseline', 'text-before-edge');
        });
        // show hand cursor on hover
        group.addClass('clickable');
        // Make the group draggable
        group.draggable();
    }


    function createBoardD3(draw, texts, boardWidth, boardHeight) {
        console.log('====> createBoardD3', draw, texts, boardWidth, boardHeight);
        // assert texts is an array and not empty of an array of arrays
        if (!Array.isArray(texts) || texts.length === 0 || Array.isArray(texts[0])) {
            console.error('Invalid input type for createBoardD3:', texts);
            return;
        }
        // log type of texts

        const nodes = texts.map(text => ({
            x: Math.random() * boardWidth*0.8,
            y: Math.random() * boardHeight*0.9,
            text: text
        }));

        console.log('nodes:', nodes);



        const simulation = d3.forceSimulation(nodes)
            .force('x', d3.forceX(d => d.x).strength(0.5))
            .force('y', d3.forceY(d => d.y).strength(0.5))
            .force('collide', d3.forceCollide(60)) // Adjust collision radius based on post-it size
            .stop();

        for (let i = 0; i < 120; ++i) simulation.tick(); // Run simulation to space out elements

        nodes.forEach(node => {
            console.log('Creating post-it:', node.text, node.x, node.y);
            postIt(draw, node.text, node.x, node.y, 110, 18);
        });

        draw.rect(boardWidth, boardHeight).fill('none').stroke({ color: '#333', width: 2 });
    }


    function createToggleVisibilityButton(target, argConfig) {
        console.log('====> createToggleVisibilityButton', target, argConfig);
        const defaults = {class: 'clickable', text:":::", callback: () => console.log('Button clicked') };
        const config = { ...defaults, ...argConfig };
        const button = document.createElement('button');
        button.setAttribute('class', config.class);
        button.textContent = config.text;
        button.addEventListener('click', () => {
            console.log('Button clicked:', target);
            if (!(target instanceof Element)) {
                console.log('Target is not a valid DOM element:', target);
                return;
            }
            if (target.style.display === 'none') {
                target.style.display = 'block';
            } else {
                target.style.display = 'none';
            }
        });
        return button;
    }


    /**
     * Asynchronously creates and manages a results board for displaying answers from the server in an SVG element.
     * 
     * @param {HTMLElement} element - The HTML element to which the results board will be attached. This is where the button and the SVG will be placed.
     * @param {Object} argConfig - An optional configuration object to customize the board's behavior and appearance.
     * @param {number} [argConfig.width=1050] - The width of the SVG drawing area.
     * @param {number} [argConfig.height=550] - The height of the SVG drawing area.
     * @param {string} [argConfig.fieldname='answers'] - The name of the field in the server response containing the answers data.
     * @param {boolean} [argConfig.hidden=false] - Whether the SVG drawing should be hidden by default.
     * 
     * @returns {Promise<void>} - This function does not return any value. It dynamically updates the DOM with the results board and listens for server-sent events to update the data.
     * 
     * @description
     * This function creates a dynamic results board, using SVG.js, to visualize data fetched from the server. It works as follows:
     * 
     * 1. **Initial Setup**:
     *    - The function accepts an HTML `element` to which a button and an SVG element are appended.
     *    - It merges default configuration values with the `argConfig` provided.
     * 
     * 2. **SVG Drawing**:
     *    - A div container (`svgDiv`) and a toggle visibility button are created and appended to the provided `element`.
     *    - The visibility of the SVG is controlled based on the `hidden` property in the config.
     * 
     * 3. **Fetching Data**:
     *    - The function fetches the answers data from the server by making a `GET` request to the `answer/{qid}` endpoint, where `qid` is obtained from the `data-ref` attribute of the `element`.
     *    - If no data is available or if a warning is received from the server, it displays a default "No data available" message.
     *    - If data is available, it creates a board using `createBoardD3`, which renders the answers in the SVG.
     * 
     * 4. **Handling Server-Sent Events**:
     *    - The function listens for server-sent events (SSE) to update the board dynamically. When an event with the ID `A-{qid}` is received, the board is cleared and redrawn with the new data.
     * 
     * @example
     * // Example usage:
     * const container = document.getElementById('results-container');
     * const config = { width: 800, height: 400, hidden: false };
     * await resultsBoard(container, config);
     * 
     * // Expected behavior:
     * // The function attaches a toggle button and an SVG board to the 'results-container' element.
     * // It fetches answers from the server and updates the board dynamically based on server-sent events.
     */

    async function resultsBoard(element, argConfig){
        console.log('====> resultsBoard', element, argConfig);
        const defaults = { width: 1050, height: 850, fieldname: 'answers',hidden: false};
        const config = { ...defaults, ...argConfig };
        // create an svg drawing by placing above icons in a grid using svg.js
        // check if id starts with #, otherwise add #
        const qid = element.getAttribute('data-ref');

        // create a div element to hold the svg element and the button
        const svgDiv = document.createElement('div');
        // create a button to toggle visibility of the svg element
        const button_visibility = createToggleVisibilityButton(svgDiv, {class: 'button'});
        // attach the them to the element
        element.appendChild(button_visibility);
        element.appendChild(svgDiv);
        // create a new svg drawing
        const draw = getSVG(svgDiv, config);


        // hide draw element if config.idden is true else show it
        if (config.hidden) {
            svgDiv.style.display = 'none';
        } else {
            svgDiv.style.display = 'block';
        }

        // fetch data from the server
        try {
            // console.log(`answers/${qid}`);
            
            const data = await doFetch(`answer/${qid}`, 'GET');
            console.log(`curl -X GET http://localhost:5050/answer/${qid} gives us ${data.answers}`);
            console.log(data);
            let texts = [];
            if ("warning" in data) {
                texts = ['No data available']; 
            } else {
                console.log('Data:', data);
                console.log('Fieldname:', config.fieldname);
                texts = data.answers; // [config.fieldname];
            }
            createBoardD3(draw, texts, config.width, config.height, 120, 18);
        } catch (error) {
            console.error('Warning:', error);
        }
        // update the board via server-sent events
        console.log(`eventSource: A-${qid}`);
        eventSource.addEventListener(`A-${qid}`, function(event) {
            console.log('Event received:', event, event.data);
            // render json data
            const data = JSON.parse(event.data);
            draw.clear();
            createBoardD3(draw, data.answers, config.width, config.height);
        });
    }

    ///////////////////////////////////////////// likert scale ///////////////////////////////////////

    function likertScale(draw, id) {
        console.log('====> likertScale', draw, id);
        const radius = 10;
        const spacing = 150;
        const labels = [
            "Stimme voll zu",
            "Stimme eher zu", 
            "Neutral", 
            "Stimme eher nicht zu", 
            "Stimme gar nicht zu"
        ];

        let x = 0;
        // Create rectangles and text labels for each point in the Likert scale
        for (let i = 0; i < 5; i++) {
            x = (i+1) * spacing;
            // Draw rectangle
            draw.circle(radius * 2)
                .center(x, 30)
                .fill('white')
                .stroke({ width: 1, color: '#000' })
                // show hand on hover
                .addClass('clickable')
                .addClass('radio-box')
                // set id: needs to be the same than the one in the database
                .attr({ id: `${id}-${i}` }); 

            // Add label below each rectangle
            const textElement = createSVGText(labels[i], x, 45,{ anchor: 'middle', size: 14, color: 'black' });
            draw.node.appendChild(textElement);
          
        }

        // Interaction with rectangles (optional)
        draw.find('.radio-box').click(function() {
            // console.log('Clicked on radio box');
            draw.find('.radio-box').fill('white'); // Reset all
            this.fill({ color: '#c0c0c0' });       // Highlight selected
            // post data to the server
            let value = this.attr('id').split('-')[1];
            let nickname = localStorage.getItem('nickname');
            // if nickname is not set, set it to 'anonymous'
            if (nickname === '-') {
                alert('Bitte wählen Sie einen Nicknamen');
            }

            let data = {user:localStorage.getItem('nickname'), likert: id, value: value};

            console.log("likert uses data:", data);
            // let isValid = validateData(likertSchema, data);
            doFetch('likert', 
                    'POST', 
                    data, 
                    (response) => {console.log(response);}
            );
            });
    }

    function likertField(element,argConfig) {
        console.log('====> likertField', element, argConfig);
        const draw = getSVG(element,{height:100});
        likertScale(draw,element.id);
    }

    function showPercentage(element, live=true) {
        console.log('====> showPercentage', element, live);
        // create div element to hold the result
        const resultDiv = document.createElement('div');
        const updateResult = async () => {
            // get data for ref attribute
            let percentage = await likertPercentage(element.getAttribute('data-ref'));
            // console.log(percentage);
            // set the text content of the element
            resultDiv.textContent = `${percentage}%`;
        };
        if(live) {
            // show the result live
            element.appendChild(resultDiv);
            eventSource.addEventListener(
                `A-${element.getAttribute('data-ref')}`, 
                function(event) {
                    // console.log('Event received:', event, event.data);
                    const data = JSON.parse(event.data);
                    resultDiv.textContent = `${data.percentage}%`;
                }); 


        } else {
            // show the result via a button click
            const resultButton = createHTMLButton( "Ergebnis", 
                                                    `button-${element.getAttribute('data-ref')}`, 
                                                    {
                                                        class: 'button', 
                                                        callback: updateResult
                                                    });
            element.appendChild(resultButton);
            element.appendChild(resultDiv);
        }
    }

    // show a toast message, by appending a div to the toast-container (see interaktive.js) temporarily
    function showToast(message, isError = false) {
        console.log('====> showToast', message, isError);
        const container = document.getElementById('toast-container');
        const toast = document.createElement('div');
        toast.className = 'toast-message toast-show';
        toast.textContent = message;
        if (isError) {
            toast.style.backgroundColor = 'red';
        }
        container.appendChild(toast);
        setTimeout(() => {
            toast.className = toast.className.replace('toast-show', '');
            setTimeout(() => container.removeChild(toast), 500);
        }, 3000);
    }

    // Unique ID creation requires a high quality random # generator. In the browser we therefore
    // require the crypto API and do not support built-in fallback to lower quality random number
    // generators (like Math.random()).
    var getRandomValues;
    var rnds8 = new Uint8Array(16);
    function rng() {
      // lazy load so that environments that need to polyfill have a chance to do so
      if (!getRandomValues) {
        // getRandomValues needs to be invoked in a context where "this" is a Crypto implementation. Also,
        // find the complete implementation of crypto (msCrypto) on IE11.
        getRandomValues = typeof crypto !== 'undefined' && crypto.getRandomValues && crypto.getRandomValues.bind(crypto) || typeof msCrypto !== 'undefined' && typeof msCrypto.getRandomValues === 'function' && msCrypto.getRandomValues.bind(msCrypto);

        if (!getRandomValues) {
          throw new Error('crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported');
        }
      }

      return getRandomValues(rnds8);
    }

    var REGEX = /^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|00000000-0000-0000-0000-000000000000)$/i;

    function validate(uuid) {
      return typeof uuid === 'string' && REGEX.test(uuid);
    }

    /**
     * Convert array of 16 byte values to UUID string format of the form:
     * XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX
     */

    var byteToHex = [];

    for (var i = 0; i < 256; ++i) {
      byteToHex.push((i + 0x100).toString(16).substr(1));
    }

    function stringify(arr) {
      var offset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
      // Note: Be careful editing this code!  It's been tuned for performance
      // and works in ways you may not expect. See https://github.com/uuidjs/uuid/pull/434
      var uuid = (byteToHex[arr[offset + 0]] + byteToHex[arr[offset + 1]] + byteToHex[arr[offset + 2]] + byteToHex[arr[offset + 3]] + '-' + byteToHex[arr[offset + 4]] + byteToHex[arr[offset + 5]] + '-' + byteToHex[arr[offset + 6]] + byteToHex[arr[offset + 7]] + '-' + byteToHex[arr[offset + 8]] + byteToHex[arr[offset + 9]] + '-' + byteToHex[arr[offset + 10]] + byteToHex[arr[offset + 11]] + byteToHex[arr[offset + 12]] + byteToHex[arr[offset + 13]] + byteToHex[arr[offset + 14]] + byteToHex[arr[offset + 15]]).toLowerCase(); // Consistency check for valid UUID.  If this throws, it's likely due to one
      // of the following:
      // - One or more input array values don't map to a hex octet (leading to
      // "undefined" in the uuid)
      // - Invalid input values for the RFC `version` or `variant` fields

      if (!validate(uuid)) {
        throw TypeError('Stringified UUID is invalid');
      }

      return uuid;
    }

    function v4(options, buf, offset) {
      options = options || {};
      var rnds = options.random || (options.rng || rng)(); // Per 4.4, set bits for version and `clock_seq_hi_and_reserved`

      rnds[6] = rnds[6] & 0x0f | 0x40;
      rnds[8] = rnds[8] & 0x3f | 0x80; // Copy bytes to buffer, if provided

      if (buf) {
        offset = offset || 0;

        for (var i = 0; i < 16; ++i) {
          buf[offset + i] = rnds[i];
        }

        return buf;
      }

      return stringify(rnds);
    }

    // Description: This file contains the list of team members.
    const icons = [ { name: "Ameise", path: "animal-ant-domestic-svgrepo-com.svg"},
                    { name: "Fisch", path: "animal-aquarium-domestic-svgrepo-com.svg"},
                    { name: "Thunfisch", path: "animal-aquarium-domestic2-svgrepo-com.svg"},
                    { name: "Kücken", path: "animal-babyduck-domestic-svgrepo-com.svg"},
                    { name: "Fledermaus", path: "animal-bat-domestic-3-svgrepo-com.svg"},
                    { name: "Vogel", path: "animal-bird-domestic-2-svgrepo-com.svg"},
                    { name: "Papagei", path: "animal-bird-domestic-4-svgrepo-com.svg"},
                    { name: "Eisvogel", path: "animal-bird-domestic-svgrepo-com.svg"},
                    { name: "Schmetterling", path: "animal-bug-butterfly-svgrepo-com.svg"},
                    { name: "Libelle", path: "animal-bug-domestic-2-svgrepo-com.svg"},
                    { name: "Fliege", path: "animal-bug-domestic-4-svgrepo-com.svg"},
                    { name: "Biene", path: "animal-bug-domestic-6-svgrepo-com.svg"},
                    { name: "Käfer", path: "animal-bug-domestic-svgrepo-com.svg"},
                    { name: "Bulle", path: "animal-bull-domestic-svgrepo-com.svg"},
                    { name: "Katze", path: "animal-cat-domestic-2-svgrepo-com.svg"},
                    { name: "Kater", path: "animal-cat-domestic-svgrepo-com.svg"},
                    { name: "Kuh", path: "animal-cow-domestic-svgrepo-com.svg"},
                    { name: "Krabbe", path: "animal-crab-domestic-svgrepo-com.svg"},
                    { name: "Krokodil", path: "animal-crocodile-domestic-svgrepo-com.svg"},
                    { name: "Hund", path: "animal-dog-domestic-3-svgrepo-com.svg"},
                    { name: "Bernhardiner", path: "animal-dog-domestic-svgrepo-com.svg"},
                    { name: "Taube", path: "animal-domestic-dove-svgrepo-com.svg"},
                    { name: "Gibbon", path: "animal-domestic-face-2-svgrepo-com.svg"},
                    { name: "Bär", path: "animal-domestic-face-3-svgrepo-com.svg"},
                    { name: "Schimpanse", path: "animal-domestic-face-4-svgrepo-com.svg"},
                    { name: "Frosch", path: "animal-domestic-frog-svgrepo-com.svg"},
                    { name: "Giraffe", path: "animal-domestic-giraffe-svgrepo-com.svg"},
                    { name: "Igel", path: "animal-domestic-hedgehog-svgrepo-com.svg"},
                    { name: "Koala", path: "animal-domestic-koala-svgrepo-com.svg"},
                    { name: "Löwe", path: "animal-domestic-lion-svgrepo-com.svg"},
                    { name: "Maus", path: "animal-domestic-mouse-svgrepo-com.svg"},
                    { name: "Octopus", path: "animal-domestic-octopus-2-svgrepo-com.svg"},
                    { name: "Qualle", path: "animal-domestic-octopus-3-svgrepo-com.svg"},
                    { name: "Tintenfisch", path: "animal-domestic-octopus-svgrepo-com.svg"},
                    { name: "Gorilla", path: "animal-domestic-orangoutang-svgrepo-com.svg"},
                    { name: "Orangutan", path: "animal-domestic-orangoutang2-svgrepo-com.svg"},
                    { name: "Eule", path: "animal-domestic-owl-svgrepo-com.svg"},
                    { name: "Panda", path: "animal-domestic-panda-svgrepo-com.svg"},
                    { name: "Nasshorn", path: "animal-domestic-pet-12-svgrepo-com.svg"},
                    { name: "Orca", path: "animal-domestic-pet-13-svgrepo-com.svg"},
                    { name: "Schildkröte", path: "animal-domestic-pet-15-svgrepo-com.svg"},
                    { name: "Hai", path: "animal-domestic-pet-17-svgrepo-com.svg"},
                    { name: "Wal", path: "animal-domestic-pet-2-svgrepo-com.svg"},
                    { name: "Esel", path: "animal-domestic-pet-3-svgrepo-com.svg"},
                    { name: "Schlange", path: "animal-domestic-pet-5-svgrepo-com.svg"},
                    { name: "Biber", path: "animal-domestic-pet-6-svgrepo-com.svg"},
                    { name: "Schnecke", path: "animal-domestic-pet-7-svgrepo-com.svg"},
                    { name: "Schwein", path: "animal-domestic-pet-svgrepo-com.svg"}
    ];

    function isValidUUID(uuid) {
        const regex = /^[0-9a-f]{8}-[0-9a-f]{4}-[4][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
        return regex.test(uuid);
    }


    // Define the callback function
    async function handleIconClick(icon, board) {
        console.log(`clicked on ${icon.name}`);
        let response = await setNickname(icon.name, localStorage.getItem('uuid'));
        if (response !== null) {
            console.log(`nickname set for ${localStorage.getItem('uuid')}: ${icon.name}`);
            localStorage.setItem('nickname',icon.name);
            // update the opacity of the icon
            updateIconOpacity(icon.name);
            // update the text board
            board.text(`Hallo\n${icon.name}`);
            // update the footer text
            changeFooter(icon.name);
            // Optionally make all icons unclickable
            setAllIconsUnclickable();
        } else {
            showToast('Error setting nickname', true);
        }
    }

    /**
     * Asynchronously creates a team SVG drawing by placing icons in a grid and updating UI elements.
     * 
     * @returns {Promise<void>} - This function does not return any value. It updates the SVG and localStorage, and interacts with server data.
     * 
     * @description
     * This function initializes an SVG drawing using the `svg.js` library to create a grid layout of icons. It performs the following key tasks:
     * 
     * 1. **SVG Drawing Setup**:
     *    - Creates an SVG canvas and sets its size to 1200x620 pixels.
     *    - Defines initial x and y coordinates and the width and height for each icon.
     * 
     * 2. **Fetching Server Data**:
     *    - Fetches the IP socket data by calling `getIPSocket()` and stores a UUID in `localStorage`.
     *    - Checks if a nickname exists on the server for the UUID by calling `getNickname()`. If found, it stores the nickname in `localStorage`.
     *    - Fetches all nicknames from the server by calling `getNicknames()`. If the request fails, an empty list is returned.
     * 
     * 3. **UI Elements**:
     *    - Creates a text board displaying a greeting and the nickname (if available) using bold, black text.
     *    - Updates the footer with the current nickname or a "NOT YET LOGGED IN" message.
     *    - Draws a rectangle and other informational texts (UUID, IP and socket number, version) on the canvas.
     * 
     * 4. **Icon Grid Generation**:
     *    - Iterates over the `icons` array to create a grid of icons, positioning each icon at (x, y) and increasing `x` and `y` to place icons in rows.
     *    - If the icon's name is not registered in the `nicknames` array, it is made clickable, allowing interaction via the `handleIconClick` function.
     *    - If the icon's name is in the `nicknames`, the icon remains unclickable and is displayed with reduced opacity.
     * 
     * 5. **Dynamic Updates**:
     *    - Calls `fetchNamesAndUpdateIcons()` to dynamically update the icons on the grid with the fetched names from the server.
     * 
     * @example
     * // Example usage:
     * await createTeam();
     * 
     * // Expected behavior:
     * // The function creates an SVG grid of icons, updates the UI with nickname and socket info, and enables interaction with unregistered icons.
     */
    async function createTeam(){
        // create a svg drawing by placing above icons in a grid using svg.js
        const draw = SVG().size('100%', '100%').addTo('#svg-team').size(1200, 620);
        let x = 0;
        let y = 0;
        let width = 95;
        let height = 95;
        let iconCount = 0;
        let ip_socket = await getIPSocket();
        
        // check wether we have a valid uuid in localStorage, if not create one
        let uuid = localStorage.getItem('uuid');
        if (!uuid || !isValidUUID(uuid)) {
            uuid = v4();
            localStorage.setItem('uuid', uuid);
        }
        // check if server has already a nickname for this uuid; getNickname returns to null if not
        let nickname = await getNickname(localStorage.getItem('uuid'));
        localStorage.setItem('nickname',nickname);

        // get all nicknames from the server, if possible otherwise return an empty list
        let nicknames = await getNicknames();
        console.log(`nicknames: ${nicknames}`);

        // create a text board in bold
        let board = draw.text(`Hallo\n${localStorage.getItem('nickname') || ''}`)
                    .move(900, 300)
                    .font({ size: 48, weight: 'bold' })
                    .fill('black');
        
        // create a footer text
        if (localStorage.getItem('nickname') === '-') {
            changeFooter("NOT YET LOGGED IN");
        } else {
            changeFooter(`${localStorage.getItem('nickname')}`);
        }


        // create a rectangle and text for the uuid, ip and socket number
        draw.rect(770, 585).fill('white').stroke({ width: 1, color: 'black' });
        draw.text(localStorage.getItem('uuid')).move(850, 30).font({ size: 16 });
        draw.text(`${ip_socket.ip}:${ip_socket.socketNr}`).move(850, 50).font({ size: 16 });
        draw.text("v 0.1.0").move(850, 70).font({ size: 16 });

        // iterate over the icons and create a grid of icons
        icons[iconCount];
        for (iconCount = 0; iconCount < icons.length; iconCount++) {
            let icon = icons[iconCount];
            let group = draw.group().translate(x, y).addClass('icon-group');
            group.image(`images/icons/${icon.path}`, width, height)
                .size(width, height).opacity(0.3)
                .id(`icon-${icon.name}`);

            console.log("DEBUG",localStorage.getItem('nickname'));
            console.log("DEBUG",localStorage.getItem('nickname') === '-');
            // if icon name not already registered (in nicknames) make it clickable
            if (!nicknames.includes(icon.name)) {
                    group.addClass('clickable');
                    group.click(() => handleIconClick(icon, board));
            } 
            // if icon.name is nickname, set opacity to 1, set board text, and footer text
            if (localStorage.getItem('nickname') === icon.name) {
                group.opacity(1);
                board.text(`Hallo\n${icon.name}`);
                changeFooter(icon.name);
            }
            // add text below the icon
            group.text(icon.name)
                .font({ size: 12 })
                // background color for the text
                .fill('white')
                .stroke('gray')
                .center(width/2, height );
            x += width;
            if (x >= 750) {
                x = 0;
                y += height;
            }
        }    // fetch the names from the server and update the icons
        fetchNamesAndUpdateIcons();
    }
    // ------------------------------ handle events ----------------------------

    window.eventSource = new EventSource(`${BASE_URL}events`); //why is necessary as I have defined it in main.js

    eventSource.addEventListener('PING', function(event) {
        console.log('Ping received:', event);
        // textcontent'/' when pingcount is even and '\' when pingcount is odd

        // document.getElementById('pingshow').textContent = `${pingCount % 2 === 0 ? '/' : '\\'}`;
    });

    eventSource.addEventListener('NICKNAME', function(event) {
        console.log('Nickname received:', event);
        const data = JSON.parse(event.data);
        console.log('New nickname:', data.nicknames);
        data.nicknames.forEach(name => updateIconOpacity(name));
    });

    eventSource.onopen = function() {
        console.log('Connection opened.');
    };

    eventSource.onerror = function(event) {
        console.log('EventSource encountered an error:', event);
    };
    // ------------------------------ functions -----------------------------


    /**
     * Asynchronously fetches nicknames from the server and updates the icon opacity based on the fetched data.
     * 
     * @returns {Promise<void>} - This function does not return any value. It updates the icons' opacity based on the server data.
     * 
     * @description
     * This function retrieves a list of nicknames from the server using the `getNicknames` function, 
     * and updates the opacity of icons based on whether their name is present in the fetched list.
     * 
     * - It first calls `getNicknames()` to fetch the current list of nicknames from the server.
     * - It then iterates through the global `icons` array to check if each icon's `name` is in the fetched `nicknames` array.
     * - If the icon's name is found in the list of nicknames, it updates the opacity of the corresponding icon by calling the `updateIconOpacity(icon.name)` function, setting its opacity to 1.
     * 
     * This function ensures that the UI dynamically reflects changes based on the server data, making certain icons visually distinct based on their registration status (names that exist on the server).
     * 
     * @example
     * // Example usage:
     * await fetchNamesAndUpdateIcons();
     * 
     * // Expected behavior:
     * // The function fetches the list of nicknames and updates the opacity of icons that have matching names in the server data.
     */
    async function fetchNamesAndUpdateIcons() {
            let nicknames = await getNicknames();
            // Update the icons based on the fetched names
            icons.forEach(icon => {
                if (nicknames.includes(icon.name)) {
                    // If the name is in the list, set the opacity to 1
                    updateIconOpacity(icon.name);
                }
            });
    }


    // Function to update the opacity of the icon
    function updateIconOpacity(name) {
        const icon = document.getElementById(`icon-${name}`);
        if (icon) {
            icon.style.opacity = 1;
            // remove the clickable class
            icon.classList.remove('clickable');
            // get parent group and remove the click event
            // const group = icon.parentElement;
            // group.off('click');
        } else {
            console.error('Icon not found for:', name);
        }
    }

    // Function to set all icons unclickable
    function setAllIconsUnclickable() {
        const icons = document.getElementsByClassName('icon-group');
        for (let icon of icons) {
            icon.classList.remove('clickable');
            // Remove click for svg.js group
            let iconSvg = SVG.adopt(icon);
            iconSvg.click(null);
        }
    }


    // change the footer text by getting the first footer element and updating the paragraph text
    function changeFooter(footerText) {
        // Get the first element with the class 'footer'
        var footerElements = document.getElementsByClassName('footer');
        
        if (footerElements.length === 0) {
            console.error('No footer element found');
            return; // Exit the function if no footer element is found
        }
        
        // Assuming the footer is a simple div or similar element
        var footer = footerElements[0]; // Get the first (or only) 'footer' element
        
        // Get the paragraph element within the footer, assuming there's at least one
        var paragraph = footer.getElementsByTagName('p')[0];
        
        if (!paragraph) {
            // If no paragraph exists, create one and append it to the footer
            paragraph = document.createElement('p');
            footer.appendChild(paragraph);
        }
        
        // Change the text content of the paragraph element
        paragraph.textContent = footerText;
    }

    async function addSubmitOnReturn(inputField, formId) {
        console.log('====> addSubmitOnReturn', inputField, formId);
        inputField.addEventListener('keydown', async function (event) {
            if (event.key === 'Enter' && !event.shiftKey) {
                event.preventDefault(); // Prevent the form from submitting in the default way
                console.log('Enter pressed to submit the form', inputField, inputField.value, formId);

                // Assuming submitForm takes the input field's value and the form's id
                if (localStorage.getItem('nickname') == '-') {
                    alert('Please set your nickname first!');
                    return;
                }
                var value = inputField.value;
                let data = {"answer": value, "qid":formId, "user":localStorage.getItem('nickname')};
                doFetch("answer", "POST", data, null) ;
                inputField.value = ''; // Clear the input field
            }
            else if (event.key === 'Enter' && event.shiftKey) ;
        });

    }

    console.log("loaded mustererkennung.js");


    function createMustererkennung(){


        // Creating the dropdown menu HTML and appending it to the SVG container
        // TODO: it seams to block quarto next/last slide buttom: why?
        // const dropdownHTML = `
        // <div class="dropdown-content" style="top: 100px; left: 50px;">
        //     <a href="#" onclick="console.log('1 clicked!'); return false;">Link 1</a>
        //     <a href="#" onclick="console.log('2 clicked!'); return false;">Link 2</a>
        //     <a href="#" onclick="console.log('3 clicked!'); return false;">Link 3</a>
        // </div>
        // `;
        // configuration for the network visualization
        const radius = 20;  // Node radius
        const networkLeftPadding = 100;  // Left padding for the network
        const networkTopPadding = 35;  // Top padding for the network
        const nodeSpacing = radius * 4;  // Vertical spacing between nodes within a layer
        const layerSpacing = radius * 10;  // Horizontal spacing between layers

        ///////////////////////////////////////////// GLOBAL VARIABLES ////////////////////////////////////////////////

        // Create an SVG element for the network visualization
        const global_draw = SVG().size('100%', '100%').addTo('#svg-mustererkennung').size(1200, 620);
        // Data model for activations and weights
        let global_networkData = {
            nodes: [],
            weights: []
        };
        // Training data for the network
        const global_trainingData = [   [[1,1,1,1]    ,[1.0,0.0,0.0,0.0]    ], // voll
                                    [[-1,-1,-1,-1],[1.0,0.0,0.0,0.0]    ],
                                    // horizontal
                                    [[1,-1,1,-1]  ,[0.0,1.0,0.0,0.0]    ], // vertikal
                                    [[-1,1,-1,1]  ,[0.0,1.0,0.0,0.0]    ],
                                    // vertical
                                    [[1,1,-1,-1]  ,[0.0,0.0,1.0,0.0]    ], // horizontal
                                    [[-1,-1,1,1]  ,[0.0,0.0,1.0,0.0]    ],
                                    // diagonal
                                    [[1,-1,-1,1]  ,[0.0,0.0,0.0,1.0]    ], // diagonal
                                    [[-1,1,1,-1]  ,[0.0,0.0,0.0,1.0]    ],
                                    // neither one, [0.25,0.25,0.25,0.25]
                                    [[1,1,1,-1]   ,[0.25,0.25,0.25,0.25]],
                                    [[1,1,-1,1]   ,[0.25,0.25,0.25,0.25]],
                                    [[1,-1,1,1]   ,[0.25,0.25,0.25,0.25]],
                                    [[-1,1,1,1]   ,[0.25,0.25,0.25,0.25]],
                                    [[-1,-1,-1,1] ,[0.25,0.25,0.25,0.25]],
                                    [[-1,-1,1,-1] ,[0.25,0.25,0.25,0.25]],
                                    [[-1,1,-1,-1] ,[0.25,0.25,0.25,0.25]],
                                    [[1,-1,-1,-1] ,[0.25,0.25,0.25,0.25]]
                                ];
        let showLayers = [true, false, false, false, false];
        let weightUsage = 'zero'; // 'random', 'optimal', 'zero'

        ///////////////////////////////////////////// CONFIG NETWORK ////////////////////////////////////////////////

        const networkNodeLabels = [ ['links-oben','rechts-oben','links-unten','rechts-unten'],
                                ['links-voll','rechts-voll','links-gemischt','rechts-gemischt'],
                                ['sp-voll,gleich','sp-voll,verschieden','sp-gemischt-gleich','sp-gemischt-verschieden'],
                                ['rot-voll','schwarz-voll',
                                 'rot-schwarz-vert','schwarz-rot-vert',
                                 'rot-schwarz-hori','schwarz-rot-hori',
                                 'rot-schwarz-diag','schwarz-rot-diag'],
                                ['voll','vert','diag','hori']];  // Labels for the nodes
        const networkLayers = networkNodeLabels.map(x => x.length);  // Nodes in each layer
        const layerFunctions = [clip, clip, clip, relu, relu];  // Activation functions for each layer
        const outputLabels = ['einfarbig', 'vertikal', 'horizontal', 'schachbrett'];  // Labels for the output layer
        const boxHeight = 20; // Height of the box as background for the text
        const boxWidth = 20; // Width of the box as background for the text
        const fontSize = 12; // Font size for the text inside the box
        const textHorLeftPadding = 5; // Horizontal padding for the text inside the box
        const tri_values = [-1, 0, 1]; // Possible values for activations and weights
        const duo_values = [0, 1]; // Possible values for activations and weights
        // configuration for the matrix
        const cellSize = 50;

        const optimal_weights = [[[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]],
                                 [[1,0,1,0],[0,1,0,1],[1,0,-1,0],[0,1,0,-1]],
                                 [[1,1,0,0],[1,-1,0,0],[0,0,1,1],[0,0,1,-1]],
                                 [[1,0,0,0],[-1,0,0,0],[0,1,0,0],[0,-1,0,0],[0,0,1,0],[0,0,-1,0],[0,0,0,1],[0,0,0,-1]],
                                 [[1,1,0,0,0,0,0,0],[0,0,1,1,0,0,0,0],[0,0,0,0,1,1,0,0],[0,0,0,0,0,0,1,1]]];

        // Assert function which throws an error if the condition is false, not just a console log (like console.assert)
        function assert(condition, message) {
            if (!condition) {
                throw new Error(message);
            }
        }
        // Assert function which throws an error if the value is undefined
        function assertDefined(value, message) {
            if (value === undefined) {
                throw new Error(message);
            }
        }

        ///////////////////////////////////////////// COLOR FUNCTIONS ///////////////////////////////////////////

        // gray colors for intervals [0,1]
        function generateGrayScaleColors(numColors) {
            let colors = [];
            for (let i = 0; i < numColors; i++) {
                let grayLevel = Math.round((i / (numColors - 1)) * 255); // Calculate the gray level from 0 to 255
                let hexGray = grayLevel.toString(16).padStart(2, '0'); // Convert gray level to a two-digit hexadecimal number
                colors.push(`#${hexGray}${hexGray}${hexGray}`); // Format as a hex code
            }
            return colors;
        }
        function mapFloatToGrayColor(value, grayScaleArray) {
            if (value === 0) {
                return 'white';  // Directly return white for zero
            } else if (value === 1) {
                return 'black';  // Directly return dark red for one
            } 
            if (value < 0 || value > 1) {
                ////console.error("Value must be between 0 and 1");
                return null;  // Handle out of bounds values
            }
            value = 1 - value;
            // Calculate the nearest index in the gray scale array
            const index = Math.round(value * (grayScaleArray.length - 1));
            return grayScaleArray[index];
        }
        // red colors for intervals [-1,1], negative values are black to white, positive values are white to red
        function generateColorScales(numColors) {
            let grayColors = [];
            let redColors = [];
        
            for (let i = 0; i < numColors; i++) {
                // Grayscale from black to white
                let grayLevel = Math.round((i / (numColors - 1)) * 255);
                let hexGray = grayLevel.toString(16).padStart(2, '0');
                grayColors.push(`#${hexGray}${hexGray}${hexGray}`);
        
                // Red scale from white to dark red
                let redLevel = Math.round((1 - i / (numColors - 1)) * 255);
                let hexRed = redLevel.toString(16).padStart(2, '0');
                redColors.push(`#${hexRed}0000`);
            }
            return { grayColors, redColors };
        }
        // generate the gray scale colors
        const grayScaleArray = generateGrayScaleColors(100);
        // generate the red scale colors
        const { grayColors, redColors } = generateColorScales(100);
        // map float to color
        function mapFloatToColor(value, grayScaleArray, redScaleArray) {
            if ( value === 0) {
                return 'white';  // Directly return white for zero
            } else if (value === -1) {
                return 'darkred';  // Directly return dark red for one
            } else if (value === 1) {
                return 'black';  // Directly return black for negative one
            }
            if (value < -1 || value > 1) {
                //console.error("Value must be between -1 and 1");
                value = Math.max(-1,Math.min(1,value)) ;  // clip the value to the interval [-1,1]
            }
            if (value === 0) {
                return 'white';  // Directly return white for zero
            } else if (value < 0) {
                // Scale the index for negative values (gray scale)
                const index = Math.round((-value) * (grayScaleArray.length - 1));
                return grayScaleArray[index];
            } else {
                // Scale the index for positive values (red scale)
                const index = Math.round(value * (redScaleArray.length - 1));
                return redScaleArray[index];
            }
        }

        

        ///////////////////////////////////////////// NETWORK FUNCTIONS ///////////////////////////////////////////

        // Initialize activations and weights
        function initializeNetwork(networkData, image) {
            global_networkData.nodes = [];
            global_networkData.weights = [];
            networkLayers.forEach((layerSize, layerIndex) => {
                let outputLayerIndex = networkLayers.length - 1;
                let inputLayerIndex = 0;
                // -- Initialize the activations for each layer
                let layerActivations = Array.from({ length: layerSize }, () => 0 );
                // for the first layer, set the activations to matrix values, concatenate the matrix
                if (layerIndex === inputLayerIndex) {
                    layerActivations = image.flat();
                }
                // -- Add the layer activations to the network data
                networkData.nodes.push(layerActivations);
                // Initialize the connection weights for each layer (between itself and the previous layer)
                // strore it in the networkData.weights[layerIndex]
                if (layerIndex !== inputLayerIndex) {
                    networkData.weights[layerIndex] = networkData.weights[layerIndex] || [];
                    let layerWeights = [];
                    let nodeWeights = [];
                    for (let nodeIndexTo = 0; nodeIndexTo < layerSize; nodeIndexTo++) {
                        if (weightUsage === 'random') {
                            if (layerIndex === outputLayerIndex) {
                                nodeWeights = Array.from({ length: networkLayers[layerIndex - 1] },getDuoRandomWeight);
                            } else {
                                nodeWeights = Array.from({ length: networkLayers[layerIndex - 1] },getTriRandomWeight);
                            }
                        } else if (weightUsage === 'optimal') {
                            nodeWeights = optimal_weights[layerIndex][nodeIndexTo];
                        } else if (weightUsage === 'zero') {
                            nodeWeights = Array.from({ length: networkLayers[layerIndex - 1] },() => 0);
                        }
                        layerWeights.push(nodeWeights);
                    }
                    networkData.weights[layerIndex] = layerWeights;
                }
            });
            // networkData.nodes.forEach((layer,layerIndex) => console.log('shape of nodes for layer',
            //                                                                 layerIndex,
            //                                                                 getShape(layer),
            //                                                                 isATensor(layer)));
            // networkData.weights.forEach((layer,layerIndex) => console.log('shape of weights for layer',
            //                                                                 layerIndex,getShape(layer),
            //                                                                 isATensor(layer)));
        }
        // forward pass function
        function forwardPass(networkData) {
            assertDefined(networkData, 'Network data is not defined');
            networkData.nodes.forEach((layer, layerIndex) => {
                if (layerIndex > 0 ) {
                    const prevLayer = networkData.nodes[layerIndex - 1];
                    const weights = networkData.weights[layerIndex];
                    layer.forEach((activation, nodeIndex) => {
                        let sum = 0;
                        prevLayer.forEach((prevActivation, prevNodeIndex) => {
                            sum += weights[nodeIndex][prevNodeIndex] * prevActivation;
                        });
                        let fun = layerFunctions[layerIndex];
                        layer[nodeIndex] = fun(sum);
                    });
                }
            });
        }

        ///////////////////////////////////////////// TRAINING FUNCTIONS ///////////////////////////////////////////

        ///// random functions

        // get random element of array
        function getRandomElement(arr) {
            return  arr[Math.floor(Math.random() * arr.length)];
        }
        // get count random elements of array
        function getRandomElements(arr, count=1) {
            let elements = [];
            for (let i = 0; i < count; i++) {
                elements.push(getRandomElement(arr));
            }
            return elements;
        }
        // Function to generate random value from -1, 0, 1
        function getTriRandomWeight() {
            return getRandomElement(tri_values);
        }
        // Function to generate random value from 0, 1
        function getDuoRandomWeight() {
            return getRandomElement(duo_values);
        }

        // cycle though the values, strict or random
        function cycleValue(value, values,strict=false) {
            let index = values.indexOf(value);
            // when strict is true, always cycle to the next value otherwise cycle 
            // to the next value with 50% probability
            if (strict || Math.random() >= 0.5) {
                // cycle to the next value
                return values[(index + 1) % values.length];
            } else {
                // cycle to the previous value
                return values[(index - 1 + values.length) % values.length];
            }
        }

        ///////////////////////////////////////////// DIAGNOSTICS ////////////////////////////////////////////

        // 
        function getError(image, networkData, trainingData) {
            assert(Array.isArray(image), 'type is not an array');
            assert(image.length === 2 && image[0].length === 2 && image[1].length === 2, 'Invalid image shape'); 
            const outputLayerIndex = networkData.nodes.length - 1;
            const outputLayer = networkData.nodes[outputLayerIndex];
            const target = trainingData.find(x => x[0].toString() === image.toString())[1];
            let error = 0;
            outputLayer.forEach((activation, nodeIndex) => {
                error += Math.pow(activation - target[nodeIndex], 2);
            });
            return error;
        }

        /////////////////////////////////////////// MATH FUNCTIONS ///////////////////////////////////////////

        function chunkArray(array, chunkSize) {
            return array.reduce((result, item, index) => {
                const chunkIndex = Math.floor(index / chunkSize);
        
                if (!result[chunkIndex]) {
                    result[chunkIndex] = []; // start a new chunk
                }
        
                result[chunkIndex].push(item);
        
                return result;
            }, []);
        }
        

        // clip function for interval [-1,1] f(x) = x for x in [-1,1] and f(x) = -1 or 1 for x < -1 or x > 1
        function clip(x) {
            if (x < -1) {
                return -1;
            } else if (x > 1) {
                return 1;
            } else {
                return x;
            }
        }
        // relu function for interval [-1,1] f(x) = x for x > 0 and f(x) = 0 for x < 0
        function relu(x) {
            return x > 0 ? (x>1? 1 : x) : 0;
        }
         // softmax on last layer
        function softmax(networkData) {
            // softmax on the last layer (without exp, just sum and divide by sum)
            const outputLayerIndex = networkData.nodes.length - 1;
            const outputLayer = networkData.nodes[outputLayerIndex];
            // const expSum = outputLayer.reduce((acc, val) => acc + Math.exp(val), 0);
            const justSum = outputLayer.reduce((acc, val) => acc + val, 0);
            outputLayer.forEach((activation, nodeIndex) => {
                // outputLayer[nodeIndex] = Math.exp(activation) / expSum;
                if (justSum === 0) {
                    outputLayer[nodeIndex] = 0;
                } else {
                    outputLayer[nodeIndex] = activation / justSum;
                }

            });
        }

        /////////////////////////////////////////// DRAWING FUNCTIONS ///////////////////////////////////////////
        // draw the 2x2 input matrix
        function drawMatrix(draw, networkData, trainingData, image, x, y) {
            const matrixGroup = draw.group();
            matrixGroup.move(x, y);
            image.forEach((row, rowIndex) => {
                row.forEach((cell, cellIndex) => {
                    const cellX = x+cellIndex * cellSize;
                    const cellY = y+rowIndex * cellSize;
                    const cellText = draw.text(cell)
                        .move(cellX + textHorLeftPadding, cellY)
                        .fill('white')
                        .font({ family: 'Helvetica', size: fontSize })
                        .hide();  // Initially hide the text
                    // <text x="{cellX + textHorLeftPadding}" y="{cellY}" fill="white" font-family="Helvetica" font-size="{fontSize}" visibility="hidden">
                    const cellBox = draw.rect(cellSize, cellSize)
                        .move(cellX, cellY)
                        .fill(cell === 1 ? 'black' : (cell === -1 ? 'darkred' : 'white'))
                        .addClass('clickable')
                        .stroke({ width: 1, color: 'gray' });
                    // mouseover effect for the cell
                    cellBox.mouseover(function() {
                        cellText.show();
                    }).mouseout(function() {
                        cellText.hide();
                    });
                    // cicle through the values on click
                    cellBox.click(function() {
                        //console.log(`Clicked on cell at row ${rowIndex} and column ${cellIndex}`);
                        const currentValue = image[rowIndex][cellIndex];
                        let newValue = -1 *currentValue;
                        //console.log(`Changing value from ${currentValue} to ${newValue}`);
                        image[rowIndex][cellIndex] = newValue;
                        networkData.nodes[0][rowIndex * 2 + cellIndex] = newValue;
                        // Update the fill color
                        this.fill(newValue === 1 ? 'black' : (newValue === -1 ? 'darkred' : 'white'));
                        // Update the text
                        cellText.text(newValue);
                        forwardPass(networkData);
                        softmax(networkData);
                        renderApp(draw, networkData, trainingData, image);
                    });
                    matrixGroup.add(cellBox).add(cellText);
                });
            });
            return matrixGroup;
        }
        function drawConnections(draw, networkData, trainingData, image) {
            assertDefined(draw, 'SVG draw object is not defined');
            assertDefined(networkData, 'Network data is not defined');
            assertDefined(networkData.nodes, 'Network nodes are not defined');
            assertDefined(networkData.weights, 'Network weights are not defined');
            assertDefined(trainingData, 'Training data is not defined');
            assertDefined(image, 'Image data is not defined');
            // Drawing lines between nodes
            networkData.nodes.forEach((layer, layerIndex) => {
                let prevLayer = [];
                let weights = [];
                if (layerIndex > 0) {
                    layer.forEach((activation, nodeIndex) => { 
                        prevLayer = networkData.nodes[layerIndex - 1];
                        weights = networkData.weights[layerIndex];
                        let weight = 0;
                        let fromX = 0;
                        let fromY = 0;
                        let toX = 0;
                        let toY = 0;
                        let line = null;
                        // create a group for the connections, with class like layer-1
                        // console.log("show layer ",layerIndex, showLayers[layerIndex])
                        const connectionsGroup = draw.group().addClass(`layer-${layerIndex}`);
                        if (showLayers[layerIndex]) {
                            connectionsGroup.show();
                        }
                        else {
                            connectionsGroup.hide();
                        }
                        prevLayer.forEach((prevActivation, prevNodeIndex) => {
                            weight = weights[nodeIndex][prevNodeIndex];
                            let lineColor = weight === 1 ? 'black' : (weight === -1 ? 'red' : 'lightgray');
                            // coodinates of the line
                            fromX = radius * 2 + (layerIndex - 1) * layerSpacing + networkLeftPadding;
                            fromY = (totalHeight - prevLayer.length * nodeSpacing) / 2 + prevNodeIndex * nodeSpacing+networkTopPadding;
                            toX = radius * 2 + layerIndex * layerSpacing+ networkLeftPadding;
                            toY = (totalHeight - layer.length * nodeSpacing) / 2 + nodeIndex * nodeSpacing+networkTopPadding;
                            console.log('fromX', fromX, 'fromY', fromY, 'toX', toX, 'toY', toY);
                            // draw the line if the layer is visible
                            {//showLayers[layerIndex]) {
                                line = draw.line(fromX, fromY, toX, toY)
                                    .stroke({ width: 3, color: lineColor })
                                    .addClass('clickable');
                            }
                            connectionsGroup.add(line);
                            
                            // 
                            // Change network weights on click
                            line.click(function() {
                                //console.log(`Clicked on line from node ${prevNodeIndex} in layer ${layerIndex - 1} to node ${nodeIndex} in layer ${layerIndex}`);
                                const currentWeight = networkData.weights[layerIndex][nodeIndex][prevNodeIndex];
                                const newWeight = cycleValue(currentWeight,tri_values,true);
                                console.debug(`Changing weight from ${currentWeight} to ${newWeight}`);
                                networkData.weights[layerIndex][nodeIndex][prevNodeIndex] = newWeight;
                                // Update the line color
                                this.stroke(newWeight === 1 ? 'black' : (newWeight === -1 ? 'red' : 'lightgray'));
                                // Update
                                forwardPass(networkData);
                                softmax(networkData);
                                renderApp(draw, networkData, trainingData, image);

                            });


                        });
                    
                    });
                }
            });
        }
        function drawNodes(draw, networkData, trainingData, image) {
            // Drawing nodes and applying colors based on activation
            networkData.nodes.forEach((layer, layerIndex) => {
                let isLastLayer = layerIndex === networkData.nodes.length - 1;
                const connectionsGroup = draw.group().addClass(`layer-${layerIndex}`);
                layer.forEach((activation, nodeIndex) => {
                    // Draw nodes and apply colors based on activation
                    const centerX = radius * 2 + layerIndex * layerSpacing+ networkLeftPadding;
                    const centerY = (totalHeight - layer.length * nodeSpacing) / 2 + nodeIndex * nodeSpacing + networkTopPadding;
                    const boxX = centerX - boxWidth / 2;
                    const boxY = centerY - boxHeight / 2;
                    const textY = boxY - boxHeight / 2 - fontSize;
                    // let fillColor = activation === 1 ? 'darkred' : (activation === -1 ? 'black' : 'white');
                    let fillColor = mapFloatToColor(activation, grayColors, redColors);
                    if (isLastLayer) {
                        fillColor = mapFloatToGrayColor(activation, grayScaleArray);
                    }
                    const circle = draw.circle(radius * 2)
                        .attr({
                            fill: fillColor,
                            stroke: '#000',
                            'stroke-width': 2
                        })
                        .center(centerX, centerY);
                    // if not output layer, add the circle to the connections group
                    if (!isLastLayer) {
                        connectionsGroup.add(circle);
                    }
                    if (showLayers[layerIndex]) {
                        connectionsGroup.show();
                    }
                    else {
                        connectionsGroup.hide();
                    }
                    // label text above the node
                    const visibility = layerIndex === 0 ? 'visible' : 'hidden';
                    const labelText = createSVGText(networkNodeLabels[layerIndex][nodeIndex],centerX,centerY - 2*radius,
                        {family: 'Helvetica', size: fontSize, color: 'black', visibility: visibility, anchor: 'middle'});
                    // svg.js has difficulties to get text right, needed sometimes a reload to show the text at the right position, so I used the code above
                    // const labelText = draw.text(networkNodeLabels[layerIndex][nodeIndex])
                    //     .move(centerX, centerY - 2*radius - 2*fontSize)
                    //     .fill('black')
                    //     .font({ family: 'Helvetica', size: fontSize, anchor: 'middle'});

                    // //draw.add(cellText1);
                    // if (showLabels || layerIndex == 0) {
                    //     labelText.show();
                    // } else {
                    //     labelText.hide();
                    // }
                    if(!isLastLayer) {
                        connectionsGroup.add(labelText);

                    }
                    
                    if (layerIndex !== 0) {
                        labelText.setAttribute('class', ''); // addClass('label');
                    }

                    // text box
                    const activationText = draw.text(activation)
                        .move(boxX + textHorLeftPadding, textY)
                        .fill('white')
                        .font({ family: 'Helvetica', size: 12 })
                        .attr({ 'text-anchor': 'left' })
                        .hide();  // Initially hide the text
                    

                    // Hover effect for nodes
                    circle.mouseover(function() {
                        this.fill({ color: 'blue' });
                        activationText.show();  // Show activation text below the node
                    }).mouseout(function() {
                        this.fill({ color: fillColor });
                        activationText.hide();  // Hide activation text
                    });


                });
            });
            // draw the output labels right to output layer
            const labelFontSize = 18;
            const outputLayerIndex = networkData.nodes.length - 1;
            const outputLayer = networkData.nodes[outputLayerIndex];

            outputLayer.forEach((activation, nodeIndex) => {
                const centerX = radius * 2 + outputLayerIndex * layerSpacing + networkLeftPadding;
                const centerY = (totalHeight - outputLayer.length * nodeSpacing) / 2 + nodeIndex * nodeSpacing;
                const textX = centerX + radius * 2;
                const textY = centerY + fontSize ;

                draw.text(outputLabels[nodeIndex])
                    .move(textX, textY)
                    .font({ family: 'Helvetica', size: labelFontSize, anchor: 'left', weight: 'bold' });
            });
        }
        function drawVisibilityButtons(draw){
            // Draw the visibility buttons
            let onShowLayerClicked = (buttonText, layerNr) => {
                showLayers[layerNr] = !showLayers[layerNr];
                draw.find(`.layer-${layerNr}`).forEach(function(element) {
                    showLayers[layerNr] ? element.show() : element.hide();
                });
                buttonText.text(`${showLayers[layerNr]?"hide":"show"} ${layerNr}`);
            };
            showLayers.forEach((showLayer,layerIndex) => {
                if (layerIndex > 0) {
                    let x = 10 + (layerIndex-1)*70, y = 10;
                    rectWithText(draw, x, y, 60, 30, () => `${showLayer?"hide":"show"} ${layerIndex}`,{
                        callback: onShowLayerClicked,
                        args: [layerIndex]
                    });
                }});
        }
        function drawWeightUsageButton(draw){
            // Use different weights for the network
            let onWeightUsageClicked = (buttonText) =>{
                console.log('Clicked on the button');
                weightUsage = cycleValue(weightUsage, ['random', 'optimal', 'zero'],true);
                buttonText.text(weightUsage);
                let images = getRandomElements(global_trainingData.slice(0,8),1);
                let testImage = chunkArray(images[0][0],2);
                // deep copy of optimal weights
                initializeNetwork(global_networkData, testImage);
                forwardPass(global_networkData);
                softmax(global_networkData);
                renderApp(draw, global_networkData, global_trainingData, testImage);
            };
            // Draw the button to toggle the weight usage
            rectWithText(draw, 510, 10, 100, 30, () => weightUsage,{
                rectFill: 'lightblue',
                callback: onWeightUsageClicked
            });
        }
        function drawError(draw,networkData, trainingData,image) {
            draw.text(`Error: ${getError(image, networkData,trainingData)}`)
                .move(300, 550)
                .fill('black')
                .font({ family: 'Helvetica', size: 48 })
                .stroke('black');
        }

        function drawLegend(draw) {
            // Draw the legend for the colors: white: 0, black:1, darkred:-1
            const legendGroup = draw.group();
            const legendX = 900;
            const legendY = 0;
            const legendWidth = 60;
            const legendHeight = 100;
            const legendRect = draw.rect(legendWidth, legendHeight)
                .move(legendX, legendY)
                .fill('white')
                .stroke({ width: 1, color: 'black' });
            legendGroup.add(legendRect);
            const legendText = draw.text('Legend')
                .move(legendX + 5, legendY + 5)
                .fill('black')
                .font({ family: 'Helvetica', size: fontSize })
                .attr({ 'text-anchor': 'left' });
            legendGroup.add(legendText);
            const legendItems = [
                { color: 'black',   label: ':   1' },
                { color: 'darkred', label: ': -1' },
                { color: 'white',   label: ':   0' }
            ];
            legendItems.forEach((item, index) => {
                const itemX = legendX + 15;
                const itemY = legendY + 40 + index * 20;
                const itemRect = draw.rect(10, 10)
                    .move(itemX, itemY)
                    .fill(item.color)
                    .stroke({ width: 1, color: 'black' });
                const itemText = draw.text(item.label)
                    .move(itemX + 15, itemY - 18)
                    .fill('black')
                    .font({ family: 'Helvetica', size: fontSize })
                    .attr({ 'text-anchor': 'left' });
                legendGroup.add(itemRect).add(itemText);
            });
        

        }

        // Calculate centering offset for each layer based on the maximum layer size
        const maxNodes = Math.max(...networkLayers); // Find the maximum number of nodes in any layer
        const totalHeight = maxNodes * nodeSpacing; // Total height needed to center the largest layer

        // Render the network visualization
        function renderApp(draw, networkData, trainingData, image) {
            assertDefined(draw, 'SVG draw object is not defined');
            // Clear the existing network
            draw.clear();
            // Draw legend
            drawLegend(draw);
            // Draw the connections
            drawConnections(draw, networkData, trainingData, image);
            // Draw the nodes
            drawNodes(draw, networkData);
            // Draw the matrix
            drawMatrix(draw, networkData, trainingData, image, 0, 250);
            // Draw the buttons
            drawVisibilityButtons(draw);
            // drawShowLabelsButton(draw);
            drawWeightUsageButton(draw);
            // Draw the corners
            origin(draw, 0, 0);
            origin(draw, 1200, 620);
            // Draw the error
            drawError(draw,networkData, trainingData, image);
         }

        // Initialize and render the network
        
        function run(testCase){
            let testImage = chunkArray(testCase[0],2);
            initializeNetwork(global_networkData, testImage);
            forwardPass(global_networkData);
            softmax(global_networkData);
            console.log('network calculated');
            renderApp(global_draw, global_networkData, global_trainingData, testImage);
        }
        let images = getRandomElements(global_trainingData.slice(0,8),1);
        run(images[0]);

    }

    var superGif = {};

    var parser = {};

    var utils = {};

    Object.defineProperty(utils, "__esModule", { value: true });
    var SuperGifUtils = /** @class */ (function () {
        function SuperGifUtils() {
        }
        SuperGifUtils.bitsToNum = function (ba) {
            return ba.reduce(function (s, n) {
                return s * 2 + n;
            }, 0);
        };
        SuperGifUtils.byteToBitArr = function (bite) {
            var a = [];
            for (var i = 7; i >= 0; i--) {
                a.push(!!(bite & (1 << i)));
            }
            return a;
        };
        SuperGifUtils.lzwDecode = function (minCodeSize, data) {
            // TODO: Now that the GIF parser is a bit different, maybe this should get an array of bytes instead of a String?
            var pos = 0; // Maybe this streaming thing should be merged with the Stream?
            var readCode = function (size) {
                var code = 0;
                for (var i = 0; i < size; i++) {
                    if (data.charCodeAt(pos >> 3) & (1 << (pos & 7))) {
                        code |= 1 << i;
                    }
                    pos++;
                }
                return code;
            };
            var output = [];
            var clearCode = 1 << minCodeSize;
            var eoiCode = clearCode + 1;
            var codeSize = minCodeSize + 1;
            var dict = [];
            var clear = function () {
                dict = [];
                codeSize = minCodeSize + 1;
                for (var i = 0; i < clearCode; i++) {
                    dict[i] = [i];
                }
                dict[clearCode] = [];
                dict[eoiCode] = null;
            };
            var code;
            var last;
            while (true) {
                last = code;
                code = readCode(codeSize);
                if (code === clearCode) {
                    clear();
                    continue;
                }
                if (code === eoiCode)
                    break;
                if (code < dict.length) {
                    if (last !== clearCode) {
                        dict.push(dict[last].concat(dict[code][0]));
                    }
                }
                else {
                    if (code !== dict.length)
                        throw new Error('Invalid LZW code.');
                    dict.push(dict[last].concat(dict[last][0]));
                }
                output.push.apply(output, dict[code]);
                if (dict.length === (1 << codeSize) && codeSize < 12) {
                    // If we're at the last code and codeSize is 12, the next code will be a clearCode, and it'll be 12 bits long.
                    codeSize++;
                }
            }
            // I don't know if this is technically an error, but some GIFs do it.
            //if (Math.ceil(pos / 8) !== data.length) throw new Error('Extraneous LZW bytes.');
            return output;
        };
        return SuperGifUtils;
    }());
    utils.SuperGifUtils = SuperGifUtils;

    Object.defineProperty(parser, "__esModule", { value: true });
    var utils_1 = utils;
    // The actual parsing; returns an object with properties.
    var SuperGifParser = /** @class */ (function () {
        function SuperGifParser(stream, handler) {
            this.stream = stream;
            this.handler = handler;
        }
        // LZW (GIF-specific)
        SuperGifParser.prototype.parseCT = function (entries) {
            var ct = [];
            for (var i = 0; i < entries; i++) {
                ct.push(this.stream.readBytes(3));
            }
            return ct;
        };
        SuperGifParser.prototype.readSubBlocks = function () {
            var size, data;
            data = '';
            do {
                size = this.stream.readByte();
                data += this.stream.read(size);
            } while (size !== 0);
            return data;
        };
        SuperGifParser.prototype.parseHeader = function () {
            var hdr = {};
            hdr.sig = this.stream.read(3);
            hdr.ver = this.stream.read(3);
            if (hdr.sig !== 'GIF')
                throw new Error('Not a GIF file.'); // XXX: This should probably be handled more nicely.
            hdr.width = this.stream.readUnsigned();
            hdr.height = this.stream.readUnsigned();
            var bits = utils_1.SuperGifUtils.byteToBitArr(this.stream.readByte());
            hdr.gctFlag = bits.shift();
            hdr.colorRes = utils_1.SuperGifUtils.bitsToNum(bits.splice(0, 3));
            hdr.sorted = bits.shift();
            hdr.gctSize = utils_1.SuperGifUtils.bitsToNum(bits.splice(0, 3));
            hdr.bgColor = this.stream.readByte();
            hdr.pixelAspectRatio = this.stream.readByte(); // if not 0, aspectRatio = (pixelAspectRatio + 15) / 64
            if (hdr.gctFlag) {
                hdr.gct = this.parseCT(1 << (hdr.gctSize + 1));
            }
            this.handler.hdr && this.handler.hdr(hdr);
        };
        SuperGifParser.prototype.parseExt = function (block) {
            var _this = this;
            var parseGCExt = function (block) {
                _this.stream.readByte(); // Always 4
                var bits = utils_1.SuperGifUtils.byteToBitArr(_this.stream.readByte());
                block.reserved = bits.splice(0, 3); // Reserved; should be 000.
                block.disposalMethod = utils_1.SuperGifUtils.bitsToNum(bits.splice(0, 3));
                block.userInput = bits.shift();
                block.transparencyGiven = bits.shift();
                block.delayTime = _this.stream.readUnsigned();
                block.transparencyIndex = _this.stream.readByte();
                block.terminator = _this.stream.readByte();
                _this.handler.gce && _this.handler.gce(block);
            };
            var parseComExt = function (block) {
                block.comment = _this.readSubBlocks();
                _this.handler.com && _this.handler.com(block);
            };
            var parsePTExt = function (block) {
                // No one *ever* uses this. If you use it, deal with parsing it yourself.
                _this.stream.readByte(); // Always 12
                block.ptHeader = _this.stream.readBytes(12);
                block.ptData = _this.readSubBlocks();
                _this.handler.pte && _this.handler.pte(block);
            };
            var parseAppExt = function (block) {
                var parseNetscapeExt = function (block) {
                    _this.stream.readByte(); // Always 3
                    block.unknown = _this.stream.readByte(); // ??? Always 1? What is this?
                    block.iterations = _this.stream.readUnsigned();
                    block.terminator = _this.stream.readByte();
                    _this.handler.app && _this.handler.app.NETSCAPE && _this.handler.app.NETSCAPE(block);
                };
                var parseUnknownAppExt = function (block) {
                    block.appData = _this.readSubBlocks();
                    // FIXME: This won't work if a handler wants to match on any identifier.
                    _this.handler.app && _this.handler.app[block.identifier] && _this.handler.app[block.identifier](block);
                };
                _this.stream.readByte(); // Always 11
                block.identifier = _this.stream.read(8);
                block.authCode = _this.stream.read(3);
                switch (block.identifier) {
                    case 'NETSCAPE':
                        parseNetscapeExt(block);
                        break;
                    default:
                        parseUnknownAppExt(block);
                        break;
                }
            };
            var parseUnknownExt = function (block) {
                block.data = _this.readSubBlocks();
                _this.handler.unknown && _this.handler.unknown(block);
            };
            block.label = this.stream.readByte();
            switch (block.label) {
                case 0xF9:
                    block.extType = 'gce';
                    parseGCExt(block);
                    break;
                case 0xFE:
                    block.extType = 'com';
                    parseComExt(block);
                    break;
                case 0x01:
                    block.extType = 'pte';
                    parsePTExt(block);
                    break;
                case 0xFF:
                    block.extType = 'app';
                    parseAppExt(block);
                    break;
                default:
                    block.extType = 'unknown';
                    parseUnknownExt(block);
                    break;
            }
        };
        SuperGifParser.prototype.parseImg = function (img) {
            var deinterlace = function (pixels, width) {
                // Of course this defeats the purpose of interlacing. And it's *probably*
                // the least efficient way it's ever been implemented. But nevertheless...
                var newPixels = new Array(pixels.length);
                var rows = pixels.length / width;
                var cpRow = function (toRow, fromRow) {
                    var fromPixels = pixels.slice(fromRow * width, (fromRow + 1) * width);
                    newPixels.splice.apply(newPixels, [toRow * width, width].concat(fromPixels));
                };
                // See appendix E.
                var offsets = [0, 4, 2, 1];
                var steps = [8, 8, 4, 2];
                var fromRow = 0;
                for (var pass = 0; pass < 4; pass++) {
                    for (var toRow = offsets[pass]; toRow < rows; toRow += steps[pass]) {
                        cpRow(toRow, fromRow);
                        fromRow++;
                    }
                }
                return newPixels;
            };
            img.leftPos = this.stream.readUnsigned();
            img.topPos = this.stream.readUnsigned();
            img.width = this.stream.readUnsigned();
            img.height = this.stream.readUnsigned();
            var bits = utils_1.SuperGifUtils.byteToBitArr(this.stream.readByte());
            img.lctFlag = bits.shift();
            img.interlaced = bits.shift();
            img.sorted = bits.shift();
            img.reserved = bits.splice(0, 2);
            img.lctSize = utils_1.SuperGifUtils.bitsToNum(bits.splice(0, 3));
            if (img.lctFlag) {
                img.lct = this.parseCT(1 << (img.lctSize + 1));
            }
            img.lzwMinCodeSize = this.stream.readByte();
            var lzwData = this.readSubBlocks();
            img.pixels = utils_1.SuperGifUtils.lzwDecode(img.lzwMinCodeSize, lzwData);
            if (img.interlaced) { // Move
                img.pixels = deinterlace(img.pixels, img.width);
            }
            this.handler.img && this.handler.img(img);
        };
        SuperGifParser.prototype.parseBlock = function () {
            var block = {};
            block.sentinel = this.stream.readByte();
            switch (String.fromCharCode(block.sentinel)) { // For ease of matching
                case '!':
                    block.type = 'ext';
                    this.parseExt(block);
                    break;
                case ',':
                    block.type = 'img';
                    this.parseImg(block);
                    break;
                case ';':
                    block.type = 'eof';
                    this.handler.eof && this.handler.eof(block);
                    break;
                default:
                    throw new Error('Unknown block: 0x' + block.sentinel.toString(16)); // TODO: Pad this with a 0.
            }
            if (block.type !== 'eof')
                setTimeout(this.parseBlock.bind(this), 0);
        };
        SuperGifParser.prototype.parse = function () {
            this.parseHeader();
            setTimeout(this.parseBlock.bind(this), 0);
        };
        return SuperGifParser;
    }());
    parser.SuperGifParser = SuperGifParser;

    var stream = {};

    Object.defineProperty(stream, "__esModule", { value: true });
    var SuperGifStream = /** @class */ (function () {
        function SuperGifStream(data) {
            this.data = data;
            this.position = 0;
        }
        SuperGifStream.prototype.readByte = function () {
            if (this.position >= this.data.length) {
                throw new Error('Attempted to read past end of stream.');
            }
            if (this.data instanceof Uint8Array) {
                return this.data[this.position++];
            }
            else {
                return this.data.charCodeAt(this.position++) & 0xFF;
            }
        };
        SuperGifStream.prototype.readBytes = function (n) {
            var bytes = [];
            for (var i = 0; i < n; i++) {
                bytes.push(this.readByte());
            }
            return bytes;
        };
        SuperGifStream.prototype.read = function (n) {
            var s = '';
            for (var i = 0; i < n; i++) {
                s += String.fromCharCode(this.readByte());
            }
            return s;
        };
        SuperGifStream.prototype.readUnsigned = function () {
            var a = this.readBytes(2);
            return (a[1] << 8) + a[0];
        };
        return SuperGifStream;
    }());
    stream.SuperGifStream = SuperGifStream;

    Object.defineProperty(superGif, "__esModule", { value: true });
    var parser_1 = parser;
    var stream_1 = stream;
    var SuperGif = /** @class */ (function () {
        function SuperGif(gifImgElement, opts) {
            var _this = this;
            this.gifImgElement = gifImgElement;
            this.options = {
                autoPlay: true
            };
            this.loading = false;
            this.ready = false;
            this.transparency = null;
            this.delay = null;
            this.disposalMethod = null;
            this.disposalRestoreFromIdx = null;
            this.lastDisposalMethod = null;
            this.frame = null;
            this.lastImg = null;
            this.playing = true;
            this.forward = true;
            this.ctxScaled = false;
            this.frames = [];
            this.frameOffsets = []; // Elements have .x and .y properties
            this.initialized = false;
            this.currentFrameIndex = -1;
            this.iterationCount = 0;
            this.stepping = false;
            this.handler = {
                hdr: this.withProgress(this.doHdr.bind(this)),
                gce: this.withProgress(this.doGCE.bind(this)),
                com: this.withProgress(this.doNothing.bind(this)),
                // I guess that's all for now.
                app: {
                    // TODO: Is there much point in actually supporting iterations?
                    NETSCAPE: this.withProgress(this.doNothing.bind(this))
                },
                img: this.withProgress(this.doImg.bind(this)),
                eof: function () {
                    _this.pushFrame();
                    _this.canvas.width = _this.hdr.width * _this.getCanvasScale();
                    _this.canvas.height = _this.hdr.height * _this.getCanvasScale();
                    _this.playerInit();
                    _this.loading = false;
                    _this.ready = true;
                    if (_this.loadCallback) {
                        _this.loadCallback(_this.gifImgElement);
                    }
                }
            };
            for (var i in opts) {
                this.options[i] = opts[i];
            }
            this.onEndListener = opts.onEnd;
            this.loopDelay = opts.loopDelay || 0;
            this.overrideLoopMode = opts.loopMode != null ? opts.loopMode : 'auto';
            this.drawWhileLoading = opts.drawWhileLoading != null ? opts.drawWhileLoading : true;
        }
        SuperGif.prototype.init = function () {
            var parentNode = this.gifImgElement.parentNode;
            var divElement = document.createElement('div');
            this.canvas = document.createElement('canvas');
            this.canvasContext = this.canvas.getContext('2d');
            this.tmpCanvas = document.createElement('canvas');
            divElement.className = this.options.enclosingClass || 'super-gif';
            divElement.appendChild(this.canvas);
            if (parentNode) {
                parentNode.insertBefore(divElement, this.gifImgElement);
                parentNode.removeChild(this.gifImgElement);
            }
            this.initialized = true;
        };
        SuperGif.prototype.loadSetup = function (callback) {
            if (this.loading) {
                return false;
            }
            if (callback) {
                this.loadCallback = callback;
            }
            this.loading = true;
            this.frames = [];
            this.clear();
            this.disposalRestoreFromIdx = null;
            this.lastDisposalMethod = null;
            this.frame = null;
            this.lastImg = null;
            return true;
        };
        SuperGif.prototype.completeLoop = function () {
            if (this.onEndListener) {
                this.onEndListener(this.gifImgElement);
            }
            this.iterationCount++;
            if (this.overrideLoopMode !== false || this.iterationCount < 0) {
                this.doStep();
            }
            else {
                this.stepping = false;
                this.playing = false;
            }
        };
        SuperGif.prototype.doStep = function () {
            this.stepping = this.playing;
            if (!this.stepping) {
                return;
            }
            this.stepFrame(1);
            var delay = this.frames[this.currentFrameIndex].delay * 10;
            if (!delay) {
                // FIXME: Should this even default at all? What should it be?
                delay = 100;
            }
            var nextFrameNo = this.getNextFrameNo();
            if (nextFrameNo === 0) {
                delay += this.loopDelay;
                setTimeout(this.completeLoop.bind(this), delay);
            }
            else {
                setTimeout(this.doStep.bind(this), delay);
            }
        };
        SuperGif.prototype.step = function () {
            if (!this.stepping) {
                setTimeout(this.doStep.bind(this), 0);
            }
        };
        SuperGif.prototype.putFrame = function () {
            var offset;
            this.currentFrameIndex = parseInt(this.currentFrameIndex.toString(), 10);
            if (this.currentFrameIndex > this.frames.length - 1) {
                this.currentFrameIndex = 0;
            }
            if (this.currentFrameIndex < 0) {
                this.currentFrameIndex = 0;
            }
            offset = this.frameOffsets[this.currentFrameIndex];
            this.tmpCanvas.getContext('2d').putImageData(this.frames[this.currentFrameIndex].data, offset.x, offset.y);
            this.canvasContext.globalCompositeOperation = 'copy';
            this.canvasContext.drawImage(this.tmpCanvas, 0, 0);
        };
        SuperGif.prototype.playerInit = function () {
            if (this.loadErrorCause)
                return;
            this.canvasContext.scale(this.getCanvasScale(), this.getCanvasScale());
            if (this.options.autoPlay) {
                this.step();
            }
            else {
                this.currentFrameIndex = 0;
                this.putFrame();
            }
        };
        SuperGif.prototype.clear = function () {
            this.transparency = null;
            this.delay = null;
            this.lastDisposalMethod = this.disposalMethod;
            this.disposalMethod = null;
            this.frame = null;
        };
        // XXX: There's probably a better way to handle catching exceptions when
        // callbacks are involved.
        SuperGif.prototype.parseStream = function (stream) {
            try {
                var parser = new parser_1.SuperGifParser(stream, this.handler);
                parser.parse();
            }
            catch (err) {
                this.handleError('parse');
            }
        };
        SuperGif.prototype.setSizes = function (width, height) {
            this.canvas.width = width * this.getCanvasScale();
            this.canvas.height = height * this.getCanvasScale();
            this.tmpCanvas.width = width;
            this.tmpCanvas.height = height;
            this.tmpCanvas.style.width = width + 'px';
            this.tmpCanvas.style.height = height + 'px';
            this.tmpCanvas.getContext('2d').setTransform(1, 0, 0, 1, 0, 0);
        };
        SuperGif.prototype.drawError = function () {
            this.canvasContext.fillStyle = 'black';
            this.canvasContext.fillRect(0, 0, this.hdr.width, this.hdr.height);
            this.canvasContext.strokeStyle = 'red';
            this.canvasContext.lineWidth = 3;
            this.canvasContext.moveTo(0, 0);
            this.canvasContext.lineTo(this.hdr.width, this.hdr.height);
            this.canvasContext.moveTo(0, this.hdr.height);
            this.canvasContext.lineTo(this.hdr.width, 0);
            this.canvasContext.stroke();
        };
        SuperGif.prototype.handleError = function (originOfError) {
            this.loadErrorCause = originOfError;
            this.hdr = {
                width: this.gifImgElement.width,
                height: this.gifImgElement.height
            }; // Fake header.
            this.frames = [];
            this.drawError();
        };
        SuperGif.prototype.doHdr = function (_hdr) {
            this.hdr = _hdr;
            this.setSizes(this.hdr.width, this.hdr.height);
        };
        SuperGif.prototype.doGCE = function (gce) {
            this.pushFrame();
            this.clear();
            this.transparency = gce.transparencyGiven ? gce.transparencyIndex : null;
            this.delay = gce.delayTime;
            this.disposalMethod = gce.disposalMethod;
            // We don't have much to do with the rest of GCE.
        };
        SuperGif.prototype.pushFrame = function () {
            if (!this.frame) {
                return;
            }
            this.frames.push({
                data: this.frame.getImageData(0, 0, this.hdr.width, this.hdr.height),
                delay: this.delay
            });
            this.frameOffsets.push({ x: 0, y: 0 });
        };
        SuperGif.prototype.doImg = function (img) {
            var _this = this;
            if (!this.frame) {
                this.frame = this.tmpCanvas.getContext('2d');
            }
            var currIndex = this.frames.length;
            //ct = color table, gct = global color table
            var ct = img.lctFlag ? img.lct : this.hdr.gct; // TODO: What if neither exists?
            if (currIndex > 0) {
                if (this.lastDisposalMethod === 3) {
                    // Restore to previous
                    // If we disposed every frame including first frame up to this point, then we have
                    // no composited frame to restore to. In this case, restore to background instead.
                    if (this.disposalRestoreFromIdx !== null) {
                        this.frame.putImageData(frames[this.disposalRestoreFromIdx].data, 0, 0);
                    }
                    else {
                        this.frame.clearRect(this.lastImg.leftPos, this.lastImg.topPos, this.lastImg.width, this.lastImg.height);
                    }
                }
                else {
                    this.disposalRestoreFromIdx = currIndex - 1;
                }
                if (this.lastDisposalMethod === 2) {
                    // Restore to background color
                    // Browser implementations historically restore to transparent; we do the same.
                    // http://www.wizards-toolkit.org/discourse-server/viewtopic.php?f=1&t=21172#p86079
                    this.frame.clearRect(this.lastImg.leftPos, this.lastImg.topPos, this.lastImg.width, this.lastImg.height);
                }
            }
            // else, Undefined/Do not dispose.
            // frame contains final pixel data from the last frame; do nothing
            //Get existing pixels for img region after applying disposal method
            var imgData = this.frame.getImageData(img.leftPos, img.topPos, img.width, img.height);
            //apply color table colors
            img.pixels.forEach(function (pixel, i) {
                // imgData.data === [R,G,B,A,R,G,B,A,...]
                if (pixel !== _this.transparency) {
                    imgData.data[i * 4 + 0] = ct[pixel][0];
                    imgData.data[i * 4 + 1] = ct[pixel][1];
                    imgData.data[i * 4 + 2] = ct[pixel][2];
                    imgData.data[i * 4 + 3] = 255; // Opaque.
                }
            });
            this.frame.putImageData(imgData, img.leftPos, img.topPos);
            if (!this.ctxScaled) {
                this.canvasContext.scale(this.getCanvasScale(), this.getCanvasScale());
                this.ctxScaled = true;
            }
            // We could use the on-page canvas directly, except that we draw a progress
            // bar for each image chunk (not just the final image).
            if (this.drawWhileLoading) {
                this.canvasContext.drawImage(this.tmpCanvas, 0, 0);
                this.drawWhileLoading = this.options.autoPlay;
            }
            this.lastImg = img;
        };
        SuperGif.prototype.doNothing = function () {
        };
        SuperGif.prototype.withProgress = function (fn) {
            return function (block) {
                fn(block);
            };
        };
        /**
         * Gets the index of the frame "up next".
         * @returns {number}
         */
        SuperGif.prototype.getNextFrameNo = function () {
            var delta = (this.forward ? 1 : -1);
            return (this.currentFrameIndex + delta + this.frames.length) % this.frames.length;
        };
        SuperGif.prototype.stepFrame = function (amount) {
            this.currentFrameIndex = this.currentFrameIndex + amount;
            this.putFrame();
        };
        SuperGif.prototype.getCanvasScale = function () {
            var scale;
            if (this.options.maxWidth && this.hdr && this.hdr.width > this.options.maxWidth) {
                scale = this.options.maxWidth / this.hdr.width;
            }
            else {
                scale = window.devicePixelRatio || 1;
            }
            return scale;
        };
        SuperGif.prototype.play = function () {
            this.playing = true;
            this.step();
        };
        SuperGif.prototype.pause = function () {
            this.playing = false;
        };
        SuperGif.prototype.isPlaying = function () {
            return this.playing;
        };
        SuperGif.prototype.getCanvas = function () {
            return this.canvas;
        };
        SuperGif.prototype.isLoading = function () {
            return this.loading;
        };
        SuperGif.prototype.isReady = function () {
            return this.ready;
        };
        SuperGif.prototype.isAutoPlay = function () {
            return this.options.autoPlay;
        };
        SuperGif.prototype.getLength = function () {
            return this.frames.length;
        };
        SuperGif.prototype.getCurrentFrame = function () {
            return this.currentFrameIndex;
        };
        SuperGif.prototype.moveTo = function (idx) {
            this.currentFrameIndex = idx;
            this.putFrame();
        };
        SuperGif.prototype.loadURL = function (src, callback) {
            var _this = this;
            if (!this.loadSetup(callback)) {
                return;
            }
            var request = new XMLHttpRequest();
            // New browsers (XMLHttpRequest2-compliant)
            request.open('GET', src, true);
            if ('overrideMimeType' in request) {
                request.overrideMimeType('text/plain; charset=x-user-defined');
            }
            else if ('responseType' in request) {
                // old browsers (XMLHttpRequest-compliant)
                // @ts-ignore
                request.responseType = 'arraybuffer';
            }
            else {
                // IE9 (Microsoft.XMLHTTP-compliant)
                // @ts-ignore
                request.setRequestHeader('Accept-Charset', 'x-user-defined');
            }
            request.onloadstart = function () {
                // Wait until connection is opened to replace the gif element with a canvas to avoid a blank img
                if (!_this.initialized) {
                    _this.init();
                }
            };
            request.onload = function () {
                if (request.status !== 200) {
                    _this.handleError('xhr - response');
                    return;
                }
                var data = request.response;
                if (data.toString().indexOf('ArrayBuffer') > 0) {
                    data = new Uint8Array(data);
                }
                var stream = new stream_1.SuperGifStream(data);
                setTimeout(function () {
                    _this.parseStream(stream);
                }, 0);
            };
            request.onerror = function () {
                _this.handleError('xhr');
            };
            request.send();
        };
        SuperGif.prototype.load = function (callback) {
            this.loadURL(this.gifImgElement.src, callback);
        };
        return SuperGif;
    }());
    superGif.SuperGif = SuperGif;

    // run a function on all div elements with type=fun.name
    function runFunction(fun) {
        console.log(`run ${fun.name}`);
        const elements = document.querySelectorAll(`div[type=${fun.name}]`);

        elements.forEach(element => {
            console.log(`execute ${fun.name} at element: ${element.id}`);
            fun(element);
        });
    }

    /////////////////////////////////////////////////////////////////////////////////////

    // create an EventSource object for the server-sent events
    // export const eventSource = new EventSource(`${BASE_URL}/events`);


    /////////////////////////////////////////////////////////////////////////////////////

    // display the IP and socket number received from the server at the ipSocketElement
    async function showIPSocket(ipSocketElement) {
        const ipSocket = await getIPSocket();
        ipSocketElement.innerHTML = `http://${ipSocket.ip}:${ipSocket.socketNr}/`;
        }

    // depending on browser, go full screen
    function goFullScreen() {
        if (document.documentElement.requestFullscreen) {
            document.documentElement.requestFullscreen();
        } else if (document.documentElement.webkitRequestFullscreen) { /* Safari */
            document.documentElement.webkitRequestFullscreen();
        } else if (document.documentElement.msRequestFullscreen) { /* IE11 */
            document.documentElement.msRequestFullscreen();
        }
    }

    // create the team visualisation and append it to the teamElement
    function teamCollection(teamElement) {
        // Create the <div> element with id="svg-team"
        const svgTeamDiv = document.createElement('div');
        svgTeamDiv.id = 'svg-team';

        // Create the <div> element with class="toast-container" and id="toast-container"
        const toastContainerDiv = document.createElement('div');
        toastContainerDiv.className = 'toast-container';
        toastContainerDiv.id = 'toast-container';


        // Alternatively, you can append them to a specific parent element
        teamElement.appendChild(svgTeamDiv);
        teamElement.appendChild(toastContainerDiv);
        createTeam();
    }

    // create the mustererkennung neural net visualization and append it to the meElement
    function mustererkennung(meElement) {
        // Create the <div> element with id="muster-team"
        const musterTeamDiv = document.createElement('div');
        musterTeamDiv.id = 'muster-team';

        meElement.appendChild(musterTeamDiv);
        createMustererkennung();
    }

    /////////////////////////////////////////////////////////////////////////////////////

    // create a input field, append it to the inputElement and allow submitting the form on return
    function inputField(inputElement) {
        console.log('====> inputField', inputElement);
        // Create the form element
        const form = document.createElement('form');

        // Create the input element
        const inputField = document.createElement('textarea');
        inputField.name = 'input';
        inputField.style.width = '300px';
        inputField.style.height = '60px';

        // Append the input field to the form
        form.appendChild(inputField);

        // Append the form to the body (or any other parent element)
        inputElement.appendChild(form);

        // register the submitOnReturn function to the input field
        addSubmitOnReturn(inputField, inputElement.id);
    }
    // collect the input field value and send it to the server
    async function inputCollection(collectionElement){
        console.log('====> inputCollection', collectionElement);
        console.log('inputCollection', collectionElement);
        // get data ref attribute
        const qid = collectionElement.getAttribute('data-ref');
        console.log('qid', qid);
        const argConfig = JSON.parse(collectionElement.getAttribute('data-argConfig'));
        console.log('argConfig', argConfig);
        await resultsBoard(collectionElement, argConfig);
    }

    /////////////////////////////////////////////////////////////////////////////////////

    // create a likert scale, append it to the likertElement
    function pollField(pollElement) {
        console.log('====> pollField', pollElement);
        likertField(pollElement);
    }

    // show the percentage of responses to the likert scale
    async function pollPercentage(percentageElement){
        // create button
        showPercentage(percentageElement);
        
    }


    /////////////////////////////////////////////////////////////////////////////////////

    // make a animated gif clickable // fails

    // document.addEventListener("DOMContentLoaded", function () {
    //     document.querySelectorAll(".clickable-gif").forEach((img) => {
    //         let isPaused = false;

    //         // Create a SuperGif instance and pass required options
    //         let superGif = new SuperGif(img, { autoPlay: false });

    //     });
    // });




    // use like this
    // <img class="clickable-gif" src="images/animated.gif" data-src="images/animated.gif" data-paused="false" alt="animated gif">
    // ![](animation.gif){.clickable-gif data-src="animation.gif" data-paused="false"}

    // register the service, when the user issues a click or keydown event, 
    // the slide number is reported to the console (TBD: and SSE)
    function registerReportSlideNumber() {
        console.log('====> registerReportSlideNumber');
        function getSlideNumber() {
            // Query the DOM for the slide number elements
            const slideNumberElement = document.querySelector('.slide-number-a');
            const totalSlidesElement = document.querySelector('.slide-number-b');

            if (slideNumberElement && totalSlidesElement) {
            const currentSlide = slideNumberElement.textContent;
            const totalSlides = totalSlidesElement.textContent;
            console.log(`Current slide: ${currentSlide} of ${totalSlides}`);
            return { currentSlide, totalSlides };
            } else {
            console.log('Slide number element not found');
            return null;
            }
        }

        // Detect keydown event (like Page Down or Arrow keys)
        document.addEventListener('keydown', function(event) {
            if (event.key === 'ArrowRight' || event.key === 'ArrowLeft' || event.key === 'PageDown' || event.key === 'PageUp') {
            getSlideNumber();
            }
        });

        // Detect click events (like clicking on navigation arrows)
        document.addEventListener('click', function(event) {
            getSlideNumber();
        });
        }

    // src/main.js

    console.log('main.js loaded');


    // export the functions/variables to the global scope
    // window.eventSource = ia.eventSource; // variable for the EventSource object
    window.goFullScreen = goFullScreen; // function to go full screen

    // run the functions when the DOM is loaded at every div element with type=fun.name
    // this makes the <div type="fun.name"> tag in your HTML act as a function call
    document.addEventListener('DOMContentLoaded', () => {
        console.log('populate divs so they are bound to functions');
        runFunction(showIPSocket);
        runFunction(goFullScreen);
        runFunction(teamCollection);
        runFunction(inputField);
        runFunction(inputCollection);
        runFunction(pollField);
        runFunction(pollPercentage);
        runFunction(mustererkennung);
    });

    // register reportSlideNumber to be called when the DOM is loaded

    document.addEventListener('DOMContentLoaded', registerReportSlideNumber);

})();
