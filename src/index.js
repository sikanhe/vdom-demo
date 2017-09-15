import { createElement, render } from './vdom'

let lists = {
  1:  {
    items: ["item1", "item2", "item3"],
    ops: []
  },
  2: {
    items: ["item1", "item2", "item3"],
    ops: []
  }
};

const createList = (listId) => createElement('div', {}, [
  createElement('ul', {}, lists[listId].items.map((item, i) =>
    createElement('li', {}, [
      item,
      createElement('button', {onClick: () => removeItem(listId, i)}, ['x'])])
    )
  ),
  createElement('button', {onClick: () => addNewItem(listId)}, ['Add new item'])
])

const createOpsList = (listId) => {
  const tree = createElement('div', {}, [
    createElement('ul', {}, lists[listId].ops.map((op, i) =>
      op.el ?
      createElement('li', {}, ['Type: ', op.type, ', Element: ', op.el])
      : createElement('li', {}, ['Type: ', op.type, ', Old: ', op.old, ', New:', op.new]))
    )
  ])

  console.log(tree)
  return tree
}

const update1 = render(createList(1), document.getElementById('list1'))
const update2 = render(createList(2), document.getElementById("list2"));

const opsUpdate1 = render(createOpsList(1), document.getElementById("ops1"));
const opsUpdate2 = render(createOpsList(2), document.getElementById("ops2"));

lists[1].update = (newVdom) => {
  const ops = update1(newVdom)
  lists[1].ops = lists[1].ops.concat(ops)
  opsUpdate1(createOpsList(1))

  console.log(ops)
}

lists[2].update = newVdom => {
  const ops = update2(newVdom);
  lists[2].ops = lists[2].ops.concat(ops);
  opsUpdate2(createOpsList(2));
};


const addNewItem = (listId, i) => {
  if (!1) {
      lists[listId].items.push("new item" + lists[listId].items.length);
  } else {
      lists[listId].items.splice(i, 0, "new item" + lists[listId].items.length);
  }

  lists[listId].update(createList(listId))
};

const removeItem = (listId, i) => {
  lists[listId].items.splice(i, 1)

  lists[listId].update(createList(listId));
}

// setInterval(() => {
//   addNewItem(1)
// }, 1000);

setInterval(() => {
  addNewItem(1, 1);
  setTimeout(() =>
    removeItem(1, 1),
    300
  )
}, 2000);