const DIM = [720, 720];

let BG_COLOR = [201, 14.7, 26.7];
let FRAMERATE = 30;
//let textSize = 75

//for switching between modes
//have selectors at the top
//also need to have some kind of intdicator for which mode you're on

window.onload = function () {
  // this is where I run code after it loads
  //look at transformation video
  console.log("Done loading");

  //html details in summary - https://www.w3schools.com/tags/tag_details.asp
  //good for collapsable type stuff

  //good design philosophy
  //common things should be simple
  //complicated things should be possible
  //goal for next time - make sure that you have a MVP - minamal viable product
  //keeping in mind what kind of ppl will be using this
  //and having a list of what you want to include in the final product

  //data goes in, events come out

  // Making your own two-way binding component that you can use with v-model like any other input element
  // e.g. <my-cool-input v-model="someValue" />
  // https://www.digitalocean.com/community/tutorials/vuejs-add-v-model-support
  // Requires #1, "value" as a prop, #2 emit "input" events when it changes
  // You can do plenty of components without this (especially display-only-ones)
  // But its useful for custom input components

  /*// <!--for debugging control hiding-->
        // {{showTextControls}}*/

  Vue.component("emoji-text-input", {
    /*
     * A custom Vue input for having both an emoji picker *and* some text input
     */
    template: `<div class="emoji-text-input">
      <input v-model="value" @input="textChanged"></input>
        <button @click="isPickerOpen=(!isPickerOpen)">😀</button>
        <!--  KATE NOTE: i added a clear button -->
        <button @click="value=''">❌</button>
        <emoji-picker v-if="isPickerOpen" @emoji-click="pickedEmoji"></emoji-picker>    
    </div>
    `,
    methods: {
      pickedEmoji(ev) {
        let emoji = ev.detail.emoji.unicode;
        console.log("selected emoji", emoji);
        this.value += emoji;
        this.textChanged();
        this.isPickerOpen = false;
      },
      textChanged() {
        console.log("text input", this.value);
        //  REQUIREMENT #2: EMIT "INPUT" EVENT with the new value
        //what does the percent mean
        this.$emit("input", this.value);
      },
    },

    data() {
      return {
        isPickerOpen: false,
      };
    },

    // REQUIREMENT #1: TAKE IN "VALUE"
    props: ["value"],
  });

  new Vue({
    template: `<div id="app"> 
      <div id="logo">
      <img src="https://cdn.glitch.global/786e4e46-1a4a-4088-8249-eb4e55e55ac2/jitterDraw%20logo%20(1).png?v=1692663269982"/>
      <img src="https://cdn.glitch.global/786e4e46-1a4a-4088-8249-eb4e55e55ac2/tagline.png?v=1692806330073" />
      </div>
      
      <div id="header">
      MODE SETTINGS
      {{modeSettings}}
      <button id="mode-buttons"
          :class = "{active: m == settings.mode}"
          v-for="m in modeOptions" 
          @click= "setMode(m)">{{m}}
        </button>
        
        <button id="save-state" @click=saveCurrentStateToHistory()> Save Current State </button>
        <select id="access-saves" @change="loadSelectedSave">
          <option v-for="(save,index) in saveStates" :value="index">{{toReadableTime(save.timestamp)}}</option>
        </select>

        <button id="save-images" @click=saveGif()>
        Download GIF</button>
        
        <!-- tweet button brought to you by custom tweet button generator: https://publish.twitter.com/?buttonType=TweetButton&widget=Button -->
        <a id= "twitter-button" href="https://twitter.com/share?ref_src=twsrc%5Etfw" class="twitter-share-button" data-size="large" data-text="Check out jitterDraw: an anxiety visualization tool" 
        data-url="https://jitterdraw.glitch.me/" 
        data-via="mariamazingart" data-dnt="true" data-show-count="false">Tweet
        </a>
      </div>
			
      <div id="p5-holder" style="width:${DIM[0]}px;height:${DIM[1]}px"></div>
      
      <div class="controls" >
      
      <div id="magic-mode-controls" v-if="settings.mode=='magic'" />
              <details>
              <summary>Motion</summary>
              Time
              <input type="range" v-model.number="settings.masterTime" min=".1" max="5" step="0.01">{{settings.masterTime}}</input>
              </details>
        
              <details>
              <summary>Emoji</summary>
              <emoji-text-input v-model="settings.ingredient1"/>
              <emoji-text-input v-model="settings.ingredient2"/>
              <emoji-text-input v-model="settings.ingredient3"/>
              </details>

              <details>
              <summary>Color</summary>
              <input type="color" v-model="settings.brothColor" >{{settings.brothColor}}</input>
              <input type="color" v-model="settings.bubbleColor">{{settings.bubbleColor}}</input>
              <input type="color" v-model="settings.glowColor">{{settings.glowColor}}</input>
              </details>
      </div>
        
        

        
        
        
      <test-controls v-if="settings.mode=='test'" :blobs="blobs"  />
        
      <div id= "text-mode-controls" v-if="settings.mode=='text'"">
        <details>
        <summary> Motion </summary>
        <!--WARNING: for number sliders you have to use v-model.number, otherwise the type will convert to string!!!-->
        <!--Source: https://stackoverflow.com/questions/49748596/vue-converts-inputtype-number-to-a-string-value-->
        <input type="range" v-model.number="settings.masterTime" min=".1" max="5" step="0.01">{{settings.masterTime}}</input>
        <input type="range" v-model.number="settings.scrollDir" min="0" max="5" step="1">{{settings.scrollDir}}</input>
        <input type="range" v-model.number="settings.watercolor" min="0" max="1" step=".1">{{settings.watercolor}}</input>
        </details>
        
        <details>
        <summary> Color 
        <button v-for="palette in paletteOptions" @click= "setToPalette(palette)">{{palette.name}}</button>
        </summary>
        <!--color palette buttons-->
        <input type="color" v-model="settings.style.palette.headColor"></input>
        {{settings.style.palette.headColor}}
        <input type="color"> {{settings.style.palette.strokeColor}}</input>
        <input type="color" v-model="settings.style.palette.phraseColor">{{settings.style.palette.phraseColor}}</input>
        <input type="color" v-model="settings.style.palette.bgColor">{{settings.style.palette.bgColor}}</input>
        </details>
        
        
        <details id= "text-controls" >
        <summary> Text </summary>
        <input type="range" v-model="settings.strokeWidth" min="1" max="10" step="1">{{settings.strokeWidth}}</input>
        <!--KATE NOTE: this is now "v-model"! like all the other inputs-->
        
        <button 
          :class = "{active: font == style.fontName}"
          v-for="font in fontOptions" 
          @click= "setFont(font)">{{font}}
        </button>
        <emoji-text-input v-model="settings.header" /> 
        <emoji-text-input v-model="settings.phrase1" /> 
        <emoji-text-input v-model="settings.phrase2" /> 
        </details>
      </div>  
      
	</div>
		</div>`,
    methods: {
      //more casual creator notes
      //you want to start the user off on a good answer
      //that pushes them to discover other good answers
      //also makes it clear how the tool is meant to work

      //consider having some presets (3-5) that change on load

      /*<!--broken
        <select name="font-names">
          <option v-for="option in font">{{font}}</option>
          <!--almost got it, but not quite--!>
        </select>  */
      //having trouble w/ the font selection
      //what I might do is figure out how to do random fonts, that would be a cool easter egg
      //another note, I need to add a color picker for changing the background
      //
      //need to add events for the text
      //actually I don't
      //the header is working properly w/o and event method
      //but the phrases aren't and I'm not sure why
      //ok found out why, it can't access  "this.thing" within the function
      //gonna try passing it in

      ///UI notes (user story - describing the ideal user experience)
      ///want to have user enter text
      //also make it easy to use emoji
      //
      //adding a button to open up the emoji picker for each text input
      //

      //when adding the emoji picker
      //should it automatically change what is in the text field
      //or should you have to highlight what is already in the field and replace it?

      // To readable time
      toReadableTime(timestamp) {
        return new Date(timestamp).toUTCString();
      },

      //something for later, need to rething the layout so that it's clear what thing changes what text/attribute
      //noticed some interesting behavior for the watercolor attribute, that the effect completely goes away
      //when you move it
      //I'm guessing that is also a scope issue
      pickedEmoji(event) {
        //https://github.com/nolanlawson/emoji-picker-element
        let emoji = event.detail.emoji.unicode; //unicode from emoji picker element
        console.log("EMOJI!!", event.detail);
        this.phrase1 += emoji;
        this.isPickerOpen = false;
      },

      setToPalette(palette) {
        console.log("setToPalette", palette);
        this.style.palette.headColor = palette.headColor;
        this.style.palette.bgColor = palette.bgColor;
        this.style.palette.strokeColor = palette.strokeColor;
        this.style.palette.phraseColor = palette.phraseColor;
      },
      setFont(font) {
        console.log("changing font to", font);
        this.style.fontName = font;
      },

      setMode(m) {
        console.log("changing mode to", m);
        this.settings.mode = m;
      },

      saveGif() {
        console.log(this.p);
        this.p.saveGif("test.gif", 2);
      },

      loadFromData(last_data) {
        //load from an object
        for (let key in last_data) {
          console.log(key, last_data[key]);
          //copying over values that aren't blobs
          if (key != "blobs") {
            this.settings[key] = last_data[key];
          }
        }
      },

      loadFromLastData() {
        //check if you have something in local storage for last data, if so, load it
        //last data should hold the last thing that happened (the most recent save data)
        //think of this as the data you have when the user last left off (navigated away from the page and came back for example)
        let last_data_json = localStorage.getItem("last_data"); //grab the data stored under this key
        if (last_data_json) {
          //checking to see if user has save data
          //whenever in vue, you are in a vue object, you need to use "this"
          let last_data = JSON.parse(last_data_json);
          console.log("you had save data:", last_data);
          //this.saveStates.push(last_data);
          //console.log("save states array:", this.saveStates);
          this.loadFromData(last_data);
        }
      },
      toSaveableData() {
        //gets save data object

        //get the data from the vue instance (this.$data)
        //^^gets all the fields in the data object

        //breaking down each function into a smaller task
        //to make it more clear what it does
        //this is the data retrieval func

        //NOTE: need to make a copy of the data (changeable data stored in settings)
        //we do this by converting to json and back again

        let data = this.settings;

        //convert to a string and then back into a json object
        //definitive way to make isolated copy
        data = JSON.parse(JSON.stringify(data));

        data.timestamp = Date.now();
        return data;
      },

      // saveState() {
      //   console.log("saving current state");
      //   //things to add for saving
      //   //clear save data
      //   //save previous states (have a dropdown menu for them)
      //   //create a method to load from data
      //   //create a save button
      //   //let el = document.getElementById("p5-holder");
      //   console.log("something changed:", val);
      //   //adding a timestamp to val
      //   val.timestamp = Date.now();
      //   console.log("current time:", val.timestamp);
      //   let json = JSON.stringify(val); //store all the data as a json file
      //   console.log(json);
      //   localStorage.setItem("last_data", json);
      // },

      saveCurrentStateToHistory() {
        //get data to save
        let data = this.toSaveableData();
        //add this data to the array holding previous saves (saveStates) and add to local storage
        this.saveStates.push(data);
        //map is the javascript equivalent of list comp)
        console.log(
          this.saveStates.map((state) => {
            //give us a list of timestamps
            return state.timestamp;
          })
        );

        //also save to local storage so saves don't get erased
        let json = JSON.stringify(this.saveStates);
        console.log(json);
        localStorage.setItem("history", json);
      },

      setSave(s) {
        //this function sets the current save from the array holding previous saves (saveStates in data)
        let json = s[0];
        localStorage.setItem("last_data", json);
      },
      saveToLastData() {
        //save the most recent changes that the user has made
        //get the current state
        //convert to json
        //add to local storage
        let data = this.toSaveableData(); //data retrieved from Vue data object
        let json = JSON.stringify(data); //store all the data as a json file
        localStorage.setItem("last_data", json);
      },

      loadHistory() {
        let json = localStorage.getItem("history"); //grab the data stored under this key
        if (json) {
          //checking to see if user has save data
          //whenever in vue, you are in a vue object, you need to use "this"
          let history = JSON.parse(json);
          console.log("you had history:", history);
          //this.saveStates.push(last_data);
          //console.log("save states array:", this.saveStates);
          this.saveStates = history;
        }
      },

      loadSelectedSave(event) {
        //https://masteringjs.io/tutorials/vue/select-onchange
        console.log(event.target.value);
        let historyIndex = event.target.value //hold index for correct item in save states
        
        //console.log(this.saveStates)
        //get the data for that specific save state
         let selectedSave = this.saveStates[historyIndex]
         console.log("selected Save data", selectedSave)
        //use load from data to update the settings with that of the selected save state
        this.loadFromData(selectedSave)
        
      },
    },

    //computed doesn't run each type, they only respond when a certain value is detected
    //values, not functions
    computed: {
      //text controls should appear for every template except the blob

      showTextControls() {
        // if (this.mode == "blob") {
        //   return false;
        // } else {
        //   return true;
        // }
      },

      modeSettings() {
        //checks for custom stuff for a given mode
        //window holds a bunch of values, you can use it to create special variable names
        if (this.settings.mode == "test") {
          return testMode;
        }
      },

      style() {
        return this.settings.style;
      },
    },

    mounted() {
      //things to add for saving
      //clear save data
      //save previous states (have a dropdown menu for them)
      //create a method to load from data
      //create a save button
      //remember mounted --> things that get called on page load
      let el = document.getElementById("p5-holder");
      //console.log(el);
      this.loadFromLastData(); //get where the user left off (if they had any previous data)
      this.loadHistory(); //make sure that you have any previous saves loaded
      //get you history if you have any

      // let last_data_json = localStorage.getItem("last_data"); //grab the data stored under this key
      // if (last_data_json) {
      //   //checking to see if user has save data
      //   let last_data = JSON.parse(last_data_json);
      //   console.log("you had save data:", last_data);
      //   for (let key in last_data) {
      //     console.log(key, last_data[key]);
      //     //copying over values that aren't blobs
      //     if (key != "blobs") {
      //       this[key] = last_data[key];
      //     }
      //   }
      // }

      //localStorage.setItem("name", "Mariama");

      //^^I need to add a color picker
      //I also want to figure out a way to toggle stroke on an off but for now I'm just going to add a slider
      //honestly all of the things using color should have a color picker so you can control more than just hue

      // Make a P5 instance in this element (saving it to p lets us use it elsewhere)
      this.p = new p5((p) => {
        // "p" is our processing instance
        p.setup = () => {
          // This runs ONCE
          // Good place to set color mode
          //when using any of the p5, methods, don't forget to
          //do p.method_name
          p.blendMode(p.MULTIPLY);
          p.colorMode(p.HSL, 360, 100, 100, 1);
          //p5 defaults to diameter for circles, so you have to set radius mode
          p.ellipseMode(p.RADIUS);
          //don't use rgb, makes gradients harder
          let c = p.createCanvas(el.offsetWidth, el.offsetHeight);
          //^^default for setting
          //p.background(this.bgColor, 31, 96);
          p.noStroke();
        };
        p.touchMoved = (ev) => {
          console.log("touch moved");
          //for optional behavior, use a ?, only does something if value exists
          this.modeSettings?.touchMoved(ev, { p, blobs: this.blobs });
        };
        p.touchStarted = (ev) => {
          console.log("touch started");
          this.modeSettings?.touchStarted(ev, { p, blobs: this.blobs });
        };
        p.touchEnded = (ev) => {
          console.log("touch ended");
          this.modeSettings?.touchEnded(ev, { p, blobs: this.blobs });
        };
        p.draw = () => {
          //do something
          //time tracking
          //for gif looping
          //need something between 0 and 1
          //first and last frame should be the same
          //
          let time = p.millis() * this.settings.masterTime * 0.001;

          //percentage of how far you are in the loop
          //modulo == remainder (modulo is really good for looping!)
          let animPCT = (time * 0.1) % 1;
          let hex2HSL = p.color(this.settings.style.palette.bgColor);
          let offset = 375;

          //console.log(hex2HSL);
          hex2HSL.setAlpha(this.settings.watercolor);
          //hex2HSL.setAlpha(0.1);
          p.background(hex2HSL);
          //console.log(this.watercolor); //cool screen blur/watercolor effect

          //bg text

          //when yoffset > y dim of the canvas the text will go offscreen
          // if (yOff > DIM[1]){
          //   yOff -= DIM[1]
          // }

          //scrollUp(drawCircle, 300);

          //drawing over the text (clipping mask)
          //
          // p.noFill();
          // p.stroke(p.color(this.bgColor));
          // p.strokeWeight(300);
          // p.circle(p.width / 2, p.height / 2, 1000);
          // p.strokeWeight(this.strokeWidth);

          //cool tip: outline with a satuted version

          //p, t, style, header, text1, text2, scrollDir, strokeSize
          switch (this.settings.mode) {
            case "text":
              drawText(
                p,
                time,
                this.settings.style,
                this.settings.header,
                this.settings.phrase1,
                this.settings.phrase2,
                this.settings.scrollDir,
                this.settings.strokeWidth
              );
              break;

            case "blob":
              drawBlob(
                p,
                time,
                this.settings.style,
                this.settings.header,
                this.settings.phrase1,
                this.settings.phrase2,
                this.settings.scrollDir,
                this.settings.strokeWidth
              );
              break;

            case "test":
              drawTest(p, this.settings.blobs, time);
              break;

            default:
              //console.log(this.settings)
              // console.log(this.ingredient1);
              // console.log(this.ingredient2);
              // console.log(this.ingredient3);
              drawMagic(
                p,
                time,
                offset,
                DIM,
                this.settings.glowColor,
                this.settings.brothColor,
                this.settings.ingredient1,
                this.settings.ingredient2,
                this.settings.ingredient3,
                this.settings.bubbleColor
              );
              break;
          }
          // p.fill(100);
          // p.rect(90, 80, 300, 100);
          // p.fill(136, 1, 0);
          // p.text(animPCT.toFixed(2), 100, 100);

          //^^use toFixed to truncate long decimals
          //drawText(p, time, this.style, this.phrase1,this.phrase2, this.scrollDir);
          //p, t, style, header, text1, text2, scrollDir, strokeSize
          //makes the text size grow and shrink for a pulsing effect
          //master time is connected to time still so it controlls the pulse rate w/o a param
          //but I should add something to set a parameter for max size (not directly 1:1 but close enough)
        };
      }, el);
    },
    data() {
      //is__ means boolean
      return {
        settings: {
          //everything that the player can change
          //don't forget to go to template and rename things!!!!
          //text setting
          emoji: "🥺",
          mode: "text",
          masterTime: 1,
          header: "SELF LOVE",
          phrase1: "amongus",
          phrase2: "big chungus",
          style: {
            palette: {
              headColor: "#5b36a2",
              phraseColor: "#69abd6",
              bgColor: "#f3d7d2",
              strokeColor: "#bf2890",
            },
            fontName: "Impact",
          },

          watercolor: 0.1,
          strokeWidth: 10,
          scrollDir: 0,

          //blob settings
          blobs: [],

          //magic
          ingredient1: "🥺",
          ingredient2: "🤓",
          ingredient3: "😢",
          brothColor: "#83f20d",
          bubbleColor: "#bcf87c",
          glowColor: "#2fff0f",
        },

        //immutables
        saveStates: [],
        isPickerOpen: false,
        modeOptions: ["text", "blob", "magic", "test"],
        fontOptions: [
          "Impact",
          "Arial",
          "Verdana",
          "Tahoma",
          "Trebuchet MS",
          "Times New Roman",
          "Georgia",
          "Garamond",
          "Courier New",
          "Brush Script MT",
          "Helvetica",
        ],
        paletteOptions: [
          //various palette options
          //add like 3-5 color presets here and create buttons for them
          {
            name: "barbie",
            headColor: "#ff66b3",
            phraseColor: "#d6006b",
            bgColor: "#000000",
            strokeColor: "#ffffff",
          },

          {
            name: "tmnt",
            headColor: "#00aae6",
            phraseColor: "#aa1bdd",
            bgColor: "#4c9c23",
            strokeColor: "#000000",
          },

          {
            name: "ppg",
            headColor: "#f6afd4",
            phraseColor: "#9bdb46",
            bgColor: "#57dcf1",
            strokeColor: "#000000",
          },

          {
            name: "google",
            headColor: "#34a853",
            phraseColor: "#fbbd05",
            bgColor: "#4285f4",
            strokeColor: "#ffffff",
          },
        ],
      };
    },
    watch: {
      //use watch to keep track of variables that change
      //nonstandard function names (like properties) can get put in quotation marks
      // "settings.mode"() {
      //   //console.log("test");
      // },
      $data: {
        handler: function (val, oldVal) {
          //deep watch can log data that is embedded in other data structures
          //everytime something changes, save to hard-drive
          //save the most recent changes in the data to local storage
          this.saveToLastData();
        },
        deep: true,
      },
    },
    el: "#app",
  });
};
