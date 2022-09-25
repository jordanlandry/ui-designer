class ListNode {
  val: number;
  next: ListNode | null;
  constructor(val: number) {
    this.val = val;
    this.next = null;
  }

  getLastValue() {
    let curr: any;
    while (curr.next) {
      curr = curr.next;
    }
    return curr;
  }
}
