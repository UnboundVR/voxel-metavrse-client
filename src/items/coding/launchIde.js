import coding from '../../coding';
import inventory from '../../inventory';
import ide from '../../ide';
import events from '../../events';
import consts from '../../constants';
import testing from './testing';
import clone from 'clone';
import chat from '../../chat';

export default {
  async create(toolbar) {
    let code =
`export default class NewItem {
  constructor(world, metadata) {
    this.world = world;
    this.metadata = metadata;
    this.world.debug(\`activating \${this.metadata.name}\`);
  }

  onExecute(position) {
    this.world.debug(\`executing \${this.metadata.name} on \${position}\`);
  }

  onHover(payload) {
    let position = payload.position.join('|');
    this.world.debug(\`\${this.metadata.name} hovering \${position}...\`);
  }

  onDestroy() {
    this.world.debug(\`deactivating \${this.metadata.name}\`);
  }
}
`;
    let data = await ide.open({
      code: {code},
      toolbar,
      type: 'item'
    });

    let codeObj = await coding.create(data.value);

    let props = {
      name: data.name,
      adjacentActive: false,
      crosshairIcon: 'code'
    };
    try {
      let newItemType = await inventory.addItemType(props, codeObj);
      events.emit(consts.events.CODE_UPDATED, {
        newId: newItemType.id,
        type: 'item',
        toolbar,
        operation: consts.coding.OPERATIONS.CREATE
      });
    } catch(err) {
      chat.error('Error creating item code', err);
      throw err;
    }
  },
  async edit(item, code, toolbar) {
    if(testing.hasTestingCode(toolbar)) {
      code = clone(code);
      code.testingLocally = true;
      code.code = testing.getTestingCode(toolbar);
    }

    let data = await ide.open({
      item,
      code,
      toolbar,
      type: 'item'
    });

    let codingOperation = data.name ? coding.fork : coding.update;
    let newCode = data.value;

    let codeObj = await codingOperation(code.id, newCode);

    let inventoryOperationResult;
    let operation;

    if(data.name) {
      operation = consts.coding.OPERATIONS.FORK;
      let props = {
        name: data.name,
        adjacentActive: item.adjacentActive,
        crosshairIcon: item.crosshairIcon
      };
      inventoryOperationResult = inventory.addItemType(props, codeObj);
    } else {
      operation = consts.coding.OPERATIONS.UPDATE;
      inventoryOperationResult = inventory.updateItemCode(item.id, codeObj);
    }

    try {
      let updatedItemType = await inventoryOperationResult;

      if(operation == consts.coding.OPERATIONS.UPDATE) {
        item.newerVersion = updatedItemType.id;
        chat.debug('Existing code was updated correctly');
      } else {
        chat.debug('Existing code was forked correctly');
      }

      events.emit(consts.events.CODE_UPDATED, {
        oldId: item.id,
        newId: updatedItemType.id,
        type: 'item',
        toolbar,
        operation
      });
    } catch(err) {
      chat.error('Error updating code', err);
      throw err;
    }
  }
};
