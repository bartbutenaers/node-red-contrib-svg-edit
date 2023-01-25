# node-red-contrib-svg-edit
Node-RED node to edit an SVG string via an integrated SVG-Edit drawing editor

I would really like to thank [Thorsten von Eicken](https://github.com/tve) for providing me the basic idea for this node. 

## Install
Run the following npm command in your Node-RED user directory (typically ~/.node-red):
```
npm install node-red-contrib-svg-edit
```

## Support my Node-RED developments

Please buy my wife a coffee to keep her happy, while I am busy developing Node-RED stuff for you ...

<a href="https://www.buymeacoffee.com/bartbutenaers" target="_blank"><img src="https://www.buymeacoffee.com/assets/img/custom_images/orange_img.png" alt="Buy my wife a coffee" style="height: 41px !important;width: 174px !important;box-shadow: 0px 3px 2px 0px rgba(190, 190, 190, 0.5) !important;-webkit-box-shadow: 0px 3px 2px 0px rgba(190, 190, 190, 0.5) !important;" ></a>

## TODO's
+ Allow the [svgedit](https://www.npmjs.com/package/svgedit) NPM package to be used as a dependency, to host svg-edit locally for offline setups.
   Currently the ***cloud version*** of svg-edit is being used (via this node's endpoint that acts as a proxy to avoid CORS issues).
+ The *"Cancel"* button - when leaving svgedit - does seem to be have incorrectly.
+ Add a custom button to the svg-edit top bar, to store the changes meanwhile to Node-RED withouth having to leave svg-edit.

## Node Usage

1. You might optionally simply paste an SVG string into the input field, for example a string exported from a third-party SVG editor:

   ![image](https://user-images.githubusercontent.com/14224149/214705852-ae04eb8b-e085-4678-bc9e-abb1fc71ff07.png)

2. Or you click the *"Open SVG-Edit"* menu item:

   ![image](https://user-images.githubusercontent.com/14224149/214705536-6bd9b6f8-9d0b-4bba-81d6-ffd2e069ff33.png)

3. As soon as the svg-edit editor opens in full screen, start drawing your shapes.

4. As soon as the full-screen editor is closed, a dialog popup will appear when something has changed:

   ![image](https://user-images.githubusercontent.com/14224149/214706916-e665e5d1-d37e-4e49-920a-a762cbaf13cd.png)

5. When the choice has been made to transfer the changes to Node-RED, the manipulated SVG string will become visible in this node's config screen.

6. Deploy the flow to save the manipulated SVG string permanently.

7. Inject a message with `msg.topic="get_svg"` to get the SVG string from the node, which will be send in the `msg.payload` of the output message:

   ![image](https://user-images.githubusercontent.com/14224149/214707932-4c63e0cb-0dd8-4390-a6f5-1d0ca46dda6e.png)
   ```
   [{"id":"eb981726b0d03720","type":"inject","z":"c447ab904053719a","name":"Get SVG string","props":[{"p":"topic","vt":"str"}],"repeat":"","crontab":"","once":false,"onceDelay":0.1,"topic":"get_svg","_mcu":{"mcu":false},"x":720,"y":320,"wires":[["9e6701dc93571698"]]},{"id":"24925d98528ee8dc","type":"debug","z":"c447ab904053719a","name":"SVG string","active":true,"tosidebar":true,"console":false,"tostatus":false,"complete":"payload","targetType":"msg","statusVal":"","statusType":"auto","_mcu":{"mcu":false},"x":1110,"y":320,"wires":[]},{"id":"9e6701dc93571698","type":"svg-edit","z":"c447ab904053719a","name":"","svgString":"<svg width=\"640\" height=\"480\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:svg=\"http://www.w3.org/2000/svg\">\n  <circle cx=\"50\" cy=\"50\" r=\"40\" fill=\"green\" />\n</svg>","x":920,"y":320,"wires":[["24925d98528ee8dc"]]}]
   ```
