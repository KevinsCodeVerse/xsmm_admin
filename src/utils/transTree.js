//生成树节点
const translator = function(parents, childrens, callback) {
  let itemParents = parents;
  let itemChildrens = childrens;
  let translatorFun = (parents, childrens) => {
    parents.forEach((parent) => {
      childrens.forEach((current, index) => {
        if (current.parentId === parent.id) {
          let temp = JSON.parse(JSON.stringify(childrens));
          temp.splice(index, 1);
          translatorFun([current], temp);
          let child = callback(current);
          child.children = current.children;
          typeof parent.children !== "undefined"
            ? parent.children.push(child)
            : (parent.children = [child]);
        }
      });
    });
  };
  translatorFun(itemParents, itemChildrens);
  return itemParents;
};
export default{
  translator
}