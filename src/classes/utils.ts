export class Utils {
  static compareNames(a, b) {
    if (a.name < b.name)
      return -1;
    if (a.name > b.name)
      return 1;
    return 0;
  }

  static comparePrices(a, b) {
    if (parseFloat(a.currencies.eur.price) > parseFloat(b.currencies.eur.price))
      return -1;
    if (parseFloat(a.currencies.eur.price) < parseFloat(b.currencies.eur.price))
      return 1;
    return 0;
  }

  static compareOrder(a, b) {
    if (Number(a.order) < Number(b.order))
      return -1;
    if (Number(a.order) > Number(b.order))
      return 1;
    return 0;
  }
}
