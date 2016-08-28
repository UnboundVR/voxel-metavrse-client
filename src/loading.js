import uuid from 'node-uuid';

/* global Pace */
let resources = {};
let loading = true;

function refreshConsole() {
  let messages = [];
  for (let key of Object.keys(resources)) {
    let resource = resources[key];
    messages.push(resource.message);
  }

  let loadingConsole = document.getElementById('loadingConsole');
  loadingConsole.innerHTML = messages.join('<br></br>');
}

export default {
  log(message) {
    if(!loading) {
      console.log(message);
    }

    let resource = {
      id: uuid.v4(),
      message,
      update(text) {
        this.message = text;

        if(!loading) {
          console.log(text);
        }

        refreshConsole();
      },
      finish(text) {
        this.message = `${text} &#x2713;`;
        this.finished = true;

        if(!loading) {
          console.log(text);
        }

        refreshConsole();
      },
      error(text) {
        this.message = `${text} &#x2717;`;

        if(!loading) {
          console.log(text);
        }
      }
    };

    resources[resource.id] = resource;

    refreshConsole();

    return resource;
  },
  finish() {
    let loadingScreen = document.getElementById('loadingScreen');
    loadingScreen.style.display = 'none';

    Pace.stop();

    loading = false;
  }
};
