interface historyValue {
  x: number;
  y: number;
}

interface pixel {
  r: number;
  b: number;
  g: number;
  a: number;
}

interface layer {
  name: string;
  id: string;
  pos: number;
  isVisible: boolean;
  data: [pixel[]];
}
