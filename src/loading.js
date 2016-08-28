import uuid from 'node-uuid';

/* global Pace */
let resources = {};
let loading = true;

function refreshConsole() {
  let messages = [];
  for (let key of Object.keys(resources)) {
    let resource = resources[key];
    let message = resource.message;

    if(resource.hasErrors) {
      message += ' &#x2717;';
    } else if(resource.finished) {
      message += ' &#x2713;';
    }

    messages.push(message);
  }

  let loadingConsole = document.getElementById('loadingConsole');
  loadingConsole.innerHTML = messages.join('<br><br>');
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
        this.message = text;
        this.finished = true;

        if(!loading) {
          console.log(text);
        }

        refreshConsole();
      },
      error(text) {
        this.message = text;
        this.hasErrors = true;

        if(!loading) {
          console.log(text);
        }

        refreshConsole();
      }
    };

    resources[resource.id] = resource;

    refreshConsole();

    return resource;
  },
  finish(success) {
    Pace.stop();
    loading = false;

    if(success) {
      let loadingScreen = document.getElementById('loadingScreen');
      loadingScreen.style.display = 'none';
    } else {
      let loadingConsole = document.getElementById('loadingConsole');
      loadingConsole.innerHTML += '<br><br><span class="consoleError">Cannot initialize due to an error</span>';
    }
  }
};
