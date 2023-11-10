import FULLTILT from './vendor/fulltilt';

import GyroNorm from 'gyronorm';
import ws from './websockets';

var args = {
  logger: logger
};

const gn = new GyroNorm();

gn.init(args).then(function() {
  var isAvailable = gn.isAvailable();
  if(!isAvailable.deviceOrientationAvailable) {
    logger({message:'Device orientation is not available.'});

    return;
  }
  if(!isAvailable.accelerationAvailable) {
    logger({message:'Device acceleration is not available.'});

    return;
  }
  if(!isAvailable.accelerationIncludingGravityAvailable) {
    logger({message:'Device acceleration incl. gravity is not available.'});

    return;
  }
  if(!isAvailable.rotationRateAvailable) {
    logger({message:'Device rotation rate is not available.'});

    return;
  }

  start_gn();
}).catch(function(e){
  console.log(e);

});

function logger(data) {
  console.log(data.message);
}

function stop_gn() {
  gn.stop();
}

function start_gn() {
  gn.start(gnCallBack);
}

function gnCallBack(data) {
  ws.send(JSON.stringify({
    x: data.dm.alpha,
    y: data.dm.beta,
    z: data.dm.gamma,
  }));
  // data.do.alpha
  // data.do.beta
  // data.do.gamma
  // data.dm.x
  // data.dm.y
  // data.dm.z
  // data.dm.gx
  // data.dm.gy
  // data.dm.gz
  // data.dm.alpha
  // data.dm.beta
  // data.dm.gamma
}

export default gn;
