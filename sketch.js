let capture;
let modelLow, modelMoto, modelLampu;
let texPattern1, texPattern2, texPattern3;

let selectedModelName = null; 
let spawnedObjects = [];      

let sfxRobot, sfxMotor, sfxLantera;


class ARObject {
  constructor(model, texture, x, y, scaleBase) {
    this.model = model;
    this.texture = texture;
    this.x = x;
    this.y = y;
    this.scaleBase = scaleBase;
    this.rotOffset = random(TWO_PI); 
  }

  display() {
    push();
    translate(this.x, this.y, 0); 
    
  
    rotateX(PI); 
    rotateY(frameCount * 0.01 + this.rotOffset);
 
    let finalScale = this.scaleBase * 120; 

   
    if (width < 800) {
       finalScale *= 1.5; 
    }
    
  
    if (width < 500) {
       finalScale *= 1.2; 
    }

    scale(finalScale / 100); 
    
    noStroke();
    if (this.texture) {
      texture(this.texture);
    } else {
      fill(255);
    }
    model(this.model);
    pop();
  }
}

function preload() {
  soundFormats('mp3');
  
  sfxRobot = loadSound('robot.mp3', () => {}, () => console.error("Err: robot.mp3"));
  sfxMotor = loadSound('motor.mp3', () => {}, () => console.error("Err: motor.mp3"));
  sfxLantera = loadSound('lantera.mp3', () => {}, () => console.error("Err: lantera.mp3"));

  modelLow = loadModel('low.obj', true);
  modelMoto = loadModel('Moto.obj', true);
  modelLampu = loadModel('Lampara.obj', true);
}

function setup() {
  let c = createCanvas(windowWidth, windowHeight, WEBGL);
  
  c.mousePressed(tambahGambar);

  let constraints = {
    audio: false,
    video: { facingMode: "user" }
  };
  
  capture = createCapture(constraints);
  capture.hide();

  setupTextures();
  userStartAudio();
}

function draw() {
  background(0);

  push();
  resetMatrix();
  translate(0, 0, -500); 
  imageMode(CENTER);

  let screenRatio = width / height;
  let videoRatio = capture.width / capture.height;
  
  if (capture.width === 0) videoRatio = 4/3;

  let finalWidth, finalHeight;

  if (screenRatio > videoRatio) {
    finalWidth = width;
    finalHeight = width / videoRatio;
  } else {
    finalHeight = height;
    finalWidth = height * videoRatio;
  }

  push();
  scale(-1, 1); 
  image(capture, 0, 0, finalWidth, finalHeight);
  pop();
  pop();

  ambientLight(150); 
  directionalLight(255, 255, 255, 1, 1, -1);
  pointLight(255, 255, 255, mouseX - width/2, mouseY - height/2, 200);

  for (let i = 0; i < spawnedObjects.length; i++) {
    spawnedObjects[i].display();
  }
}

function selectAsset(name) {
  console.log("Mode Terpilih: " + name);
  selectedModelName = name;
}

function tambahGambar() {
  if (getAudioContext().state !== 'running') {
    getAudioContext().resume();
  }

  if (selectedModelName !== null) {
    
    let m, t, s;
    
   
    if (selectedModelName === 'low') {
      m = modelLow; t = texPattern1; s = 0.8; 
      if(sfxRobot.isLoaded()) sfxRobot.play();
    } 
    else if (selectedModelName === 'moto') {
      m = modelMoto; t = texPattern2; s = 0.5; 
      if(sfxMotor.isLoaded()) sfxMotor.play();
    } 
    else if (selectedModelName === 'lampu') {
      m = modelLampu; t = texPattern3; s = 0.6; 
      if(sfxLantera.isLoaded()) sfxLantera.play();
    }

    let posX = mouseX - width / 2;
    let posY = mouseY - height / 2;

    let objekBaru = new ARObject(m, t, posX, posY, s);
    spawnedObjects.push(objekBaru);
  }
}

function resetAR() {
  selectedModelName = null;
  spawnedObjects = []; 
  stopAllSounds();
}

function stopAllSounds() {
  if(sfxRobot && sfxRobot.isPlaying()) sfxRobot.stop();
  if(sfxMotor && sfxMotor.isPlaying()) sfxMotor.stop();
  if(sfxLantera && sfxLantera.isPlaying()) sfxLantera.stop();
}

function setupTextures() {
  texPattern1 = createGraphics(200, 200); texPattern1.background(255, 200, 100); texPattern1.fill(200, 50, 50); texPattern1.rect(0,0,100,100); texPattern1.rect(100,100,100,100);
  texPattern2 = createGraphics(200, 200); texPattern2.background(100, 200, 255); texPattern2.stroke(255); texPattern2.strokeWeight(5); for(let i=0; i<200; i+=20) texPattern2.line(0, i, 200, i+20);
  texPattern3 = createGraphics(200, 200); texPattern3.background(100, 255, 100); texPattern3.fill(0, 100, 0); for(let i=0; i<50; i++) texPattern3.ellipse(random(200), random(200), 20, 20);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}