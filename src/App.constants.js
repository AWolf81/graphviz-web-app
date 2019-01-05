export const DEFAULT_CODEMIRROR_THEME = "default";
export const DEFAULT_EXPORT_NAME = "diagram";
export const examples = [
  {
    id: 0,
    caption: "Simple",
    data: `digraph G {
  ## Comment with double hash char
  Hello->World
}`
  },
  {
    id: 1,
    caption: "State machine",
    data: `digraph finite_state_machine {
  rankdir=LR;
  size="8,5"
  node [shape = doublecircle]; LR_0 LR_3 LR_4 LR_8;
  node [shape = circle];
  LR_0 -> LR_2 [ label = "SS(B)" ];
  LR_0 -> LR_1 [ label = "SS(S)" ];
  LR_1 -> LR_3 [ label = "S($end)" ];
  LR_2 -> LR_6 [ label = "SS(b)" ];
  LR_2 -> LR_5 [ label = "SS(a)" ];
  LR_2 -> LR_4 [ label = "S(A)" ];
  LR_5 -> LR_7 [ label = "S(b)" ];
  LR_5 -> LR_5 [ label = "S(a)" ];
  LR_6 -> LR_6 [ label = "S(b)" ];
  LR_6 -> LR_5 [ label = "S(a)" ];
  LR_7 -> LR_8 [ label = "S(b)" ];
  LR_7 -> LR_5 [ label = "S(a)" ];
  LR_8 -> LR_6 [ label = "S(b)" ];
  LR_8 -> LR_5 [ label = "S(a)" ];
}`
  },
  {
    id: 2,
    caption: "Crazy",
    url: "https://graphviz.gitlab.io/_pages/Gallery/directed/crazy.gv.txt"
  },
  {
    id: 3,
    caption: "PSG",
    url: "https://graphviz.gitlab.io/_pages/Gallery/directed/psg.gv.txt"
  },
  {
    id: 4,
    caption: "Traffic lights", // loaded via ajax --> huge definition
    url:
      "https://graphviz.gitlab.io/_pages/Gallery/directed/traffic_lights.gv.txt"
  },
  {
    id: 5,
    caption: "Grouped",
    data: `digraph {
  ## example grouped (a goes to b & d, b&d result in c)
  a-> {
    b,
    d
  } -> c
}`
  }
];
