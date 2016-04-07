import coding from '../coding';

export default {
  codeBlock(position) {
    coding.editCode(position).catch(err => {
      alert(err);
    });
  }
};
