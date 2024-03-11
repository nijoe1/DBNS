import { Button } from "@chakra-ui/react";

export default function NavbarLogo(): JSX.Element {
  const navigateToHashRoute = (hashRoute: any) => {
    if (hashRoute == "/") {
      window.location.hash = "/";
    } else {
      window.location.hash = hashRoute;
    }
  };
  return (
    <Button onClick={() => navigateToHashRoute("/")}>
      <DBNSLogo />
    </Button>
  );
}

type Props = {
  color?: "red" | "white";
};

const colors = {
  red: "#f85959",
  white: "#ffffff",
};

function DBNSLogo(props: Props): JSX.Element {
  const { color = "red" } = props;

  return (
    <svg
      version="1.0"
      xmlns="http://www.w3.org/2000/svg"
      width="30pt"
      height="29pt"
      fill={colors[color]}
      viewBox="0 0 300.000000 297.000000"
      preserveAspectRatio="xMidYMid meet"
    >
      <metadata>
        Created by potrace 1.10, written by Peter Selinger 2001-2011
      </metadata>
      <g
        transform="translate(0.000000,297.000000) scale(0.100000,-0.100000)"
        fill="#000000"
        stroke="none"
      >
        <path
          d="M1065 2564 c-214 -123 -399 -229 -410 -234 -11 -5 -91 -51 -178 -102
  l-158 -93 0 -655 1 -655 167 -96 c93 -52 321 -183 508 -289 187 -107 368 -211
  402 -232 l62 -37 67 40 c56 34 179 105 489 280 28 15 170 97 318 182 l267 154
  1 654 0 654 -378 217 c-208 119 -416 239 -463 266 -260 150 -300 172 -302 171
  -2 0 -178 -101 -393 -225z m470 138 c71 -39 687 -390 893 -510 61 -36 116 -70
  122 -77 6 -7 10 -242 11 -635 0 -504 -2 -625 -13 -635 -11 -11 -680 -396 -828
  -478 -30 -16 -82 -46 -115 -65 -130 -76 -139 -80 -161 -72 -17 7 -439 247
  -963 549 -87 50 -116 72 -121 91 -3 14 -6 296 -6 627 1 588 2 603 21 622 22
  22 1064 620 1080 620 6 0 42 -17 80 -37z"
        />
        <path
          d="M1270 2476 c-599 -339 -650 -370 -650 -402 0 -33 193 -154 246 -154
  34 0 21 -6 343 178 277 160 242 153 375 73 217 -129 444 -251 469 -251 16 0
  47 11 70 24 23 13 63 36 89 51 91 51 103 89 41 133 -26 18 -260 154 -343 198
  -19 11 -37 21 -40 24 -3 3 -16 11 -30 17 -14 7 -47 26 -75 43 -27 16 -57 33
  -65 37 -8 5 -61 34 -117 66 -55 31 -112 57 -124 57 -13 0 -98 -42 -189 -94z
  m600 -170 c217 -125 397 -231 398 -236 2 -6 -2 -10 -8 -10 -7 0 -54 -25 -105
  -55 -52 -30 -97 -55 -100 -55 -7 0 -565 318 -582 332 -8 6 -24 1 -50 -16 -35
  -22 -406 -235 -514 -295 l-47 -25 -48 30 c-27 16 -75 43 -106 59 -32 17 -57
  33 -55 38 4 12 801 466 812 463 6 -2 188 -106 405 -230z"
        />
        <path
          d="M1215 1939 c-195 -109 -245 -140 -260 -163 -12 -18 -15 -62 -15 -226
  -1 -202 0 -204 23 -228 l24 -24 64 34 c203 107 309 174 324 206 14 27 16 65
  13 232 -3 186 -4 200 -23 214 -11 9 -25 16 -30 16 -6 0 -60 -27 -120 -61z
  m137 -181 l-3 -213 -181 -105 c-100 -58 -184 -106 -187 -108 -4 -1 -5 95 -4
  214 l2 216 168 95 c92 52 174 101 182 108 8 8 17 12 20 11 3 -2 5 -100 3 -218z"
        />
        <path
          d="M1555 1984 c-19 -14 -20 -29 -23 -211 -2 -108 -1 -207 3 -220 5 -21
  52 -73 66 -73 4 0 36 -17 70 -38 35 -21 96 -56 134 -77 39 -20 75 -41 80 -45
  25 -18 45 -18 69 1 l26 20 0 213 c0 207 -1 213 -22 234 -36 33 -354 213 -375
  212 -4 0 -17 -7 -28 -16z m180 -106 c72 -42 147 -85 168 -96 l39 -20 1 -216
  c1 -119 -1 -215 -4 -214 -3 2 -87 50 -187 107 l-182 103 0 221 c0 209 1 219
  18 205 9 -8 76 -49 147 -90z"
        />
        <path
          d="M516 1891 c-16 -17 -18 -60 -22 -458 -2 -298 0 -449 7 -471 11 -33
  47 -62 152 -121 20 -12 54 -31 75 -42 20 -12 78 -45 127 -74 50 -29 115 -66
  145 -83 30 -17 116 -64 190 -106 74 -42 140 -76 146 -76 6 0 20 10 32 23 20
  21 22 34 22 133 0 89 -4 115 -19 139 -13 21 -76 63 -221 145 -112 63 -227 129
  -256 145 -104 60 -93 16 -98 388 -3 248 -7 331 -17 343 -30 37 -198 134 -231
  134 -8 0 -23 -9 -32 -19z m39 -11 c3 -5 51 -35 106 -66 l100 -57 -1 -339 -2
  -340 294 -167 293 -166 5 -128 c5 -136 3 -143 -41 -109 -13 11 -96 59 -184
  108 -88 49 -258 146 -377 214 l-218 125 0 468 c0 432 3 492 25 457z"
        />
        <path
          d="M2270 1865 c-47 -25 -100 -61 -118 -80 l-32 -35 1 -321 c0 -177 -3
  -325 -7 -329 -8 -8 -422 -248 -504 -292 -73 -40 -80 -56 -80 -183 0 -106 2
  -116 24 -142 l24 -28 38 18 c49 24 731 414 766 439 15 10 30 29 34 41 4 12 7
  224 6 471 -2 551 8 525 -152 441z m113 -442 l-1 -468 -390 -225 c-214 -124
  -396 -231 -404 -237 -8 -7 -17 -11 -19 -9 -2 2 -3 62 -1 133 l3 129 47 25 c26
  13 159 87 294 164 l247 140 1 342 0 341 113 65 c61 36 112 66 112 66 0 1 -1
  -209 -2 -466z"
        />
        <path
          d="M1405 1369 c-116 -60 -318 -184 -331 -204 -8 -12 -12 -30 -8 -39 6
  -16 80 -65 244 -158 145 -83 144 -83 226 -39 138 74 281 161 303 185 22 24 23
  27 8 49 -13 21 -75 62 -187 124 -136 76 -189 103 -201 103 -8 -1 -32 -10 -54
  -21z m268 -134 c86 -48 157 -91 157 -95 0 -4 -12 -12 -27 -19 -16 -7 -99 -53
  -187 -103 l-158 -91 -37 22 c-20 11 -102 58 -183 104 -81 45 -146 85 -145 89
  1 5 85 55 187 112 184 104 184 104 210 87 14 -10 96 -57 183 -106z"
        />
      </g>
    </svg>
  );
}
