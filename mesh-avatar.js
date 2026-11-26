/*! mesh-avatar-element (standalone build) — Mesh Avatar Studio by shinshin86 — MIT License — https://github.com/shinshin86/mesh-avatar-studio */
/*! fflate
MIT License

Copyright (c) 2026 Arjun Barrett

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/
function Ze(t, e) {
  const n = [0];
  for (let i = 1; i < t.length; i++) n.push(n.at(-1) + Math.hypot(t[i][0] - t[i - 1][0], t[i][1] - t[i - 1][1]));
  const s = Math.max(0, Math.min(1, e)) * n.at(-1);
  let a = 1;
  for (; a < t.length - 1 && n[a] < s; ) a++;
  const o = (s - n[a - 1]) / Math.max(1e-9, n[a] - n[a - 1]);
  return t[a - 1].map((i, c) => i + (t[a][c] - i) * o);
}
const Bt = (t) => t.slice(1).reduce((e, n, s) => e + Math.hypot(n[0] - t[s][0], n[1] - t[s][1]), 0);
function Ln(t, e) {
  let n = 0;
  const s = Bt(t), a = [];
  for (let i = 1; i < t.length; i++) {
    const c = t[i - 1], w = t[i], y = w[0] - c[0], g = w[1] - c[1], h = Math.hypot(y, g);
    for (let m = 1; m < e.length; m++) {
      const f = e[m - 1], l = e[m], p = l[0] - f[0], u = l[1] - f[1], v = y * u - g * p;
      if (Math.abs(v) < 1e-9) continue;
      const r = ((f[0] - c[0]) * u - (f[1] - c[1]) * p) / v, d = ((f[0] - c[0]) * g - (f[1] - c[1]) * y) / v;
      r >= -1e-8 && r <= 1 + 1e-8 && d >= -1e-8 && d <= 1 + 1e-8 && a.push((n + r * h) / s);
    }
    n += h;
  }
  const o = a.filter((i, c) => a.findIndex((w) => Math.abs(i - w) < 1e-7) === c);
  if (o.length !== 1) throw new RangeError("Each tier must cross every column exactly once");
  return o[0];
}
function ln(t) {
  const e = !!(t.seams?.length || t.tiers?.length), n = t.seams?.length || (t.columns ?? 8), s = t.seams?.length ? t.seams : Array.from({ length: n }, (g, h) => [Ze(t.waist, h / (n - 1)), Ze(t.hem, h / (n - 1))]);
  if (e && s.some((g) => Bt(g) < 1)) throw new RangeError("Columns must have nonzero source length");
  const a = s.map((g) => [0, ...t.tiers?.length ? t.tiers.map((h) => Ln(g, h)) : [0.5], 1]);
  for (const g of a) if (g.some((h, m) => m > 0 && h - g[m - 1] < 1e-3)) throw new RangeError("Tier intersections must be ordered from waist to hem, with nonzero links");
  const o = a[0].length - 1, i = e ? Math.max(2, Math.ceil(((t.rows ?? 5) - 1) / o)) : 0, c = e ? o * i + 1 : t.rows ?? 5, w = new Float64Array(c * n * 2), y = [];
  for (let g = 0; g < n; g++) {
    y[g] = [];
    for (let h = 0; h < c; h++) {
      const m = e ? Math.min(o - 1, Math.floor(h / i)) : 0, f = e ? (h - m * i) / i : h / (c - 1), l = e ? a[g][m] + (a[g][m + 1] - a[g][m]) * f : f;
      y[g].push(l), w.set(Ze(s[g], l), (h * n + g) * 2);
    }
  }
  if (e) for (let g = 0; g < c - 1; g++) for (let h = 0; h < n - 1; h++) {
    const m = (g * n + h) * 2, f = m + 2, l = m + n * 2, p = l + 2, u = (v, r, d) => (w[r] - w[v]) * (w[d + 1] - w[v + 1]) - (w[r + 1] - w[v + 1]) * (w[d] - w[v]);
    if (u(m, f, p) <= 1e-6 || u(m, p, l) <= 1e-6) throw new RangeError("Columns must be ordered left to right without crossing");
  }
  return { custom: e, cols: n, rows: c, rest: w, seams: s, joints: a, fractions: y, lengths: s.map(Bt), top: s.map((g) => g[0]) };
}
const he = (t, e, n) => {
  (typeof t != "number" || !Number.isFinite(t)) && n.push(`${e}: expected a finite number`);
}, ve = (t, e, n) => {
  he(t, e, n), typeof t == "number" && t <= 0 && n.push(`${e}: must be positive`);
}, Xe = (t, e, n) => {
  he(t, e, n), typeof t == "number" && t < 0 && n.push(`${e}: must be nonnegative`);
}, kn = (t, e, n) => {
  Xe(t, e, n), typeof t == "number" && (!Number.isInteger(t) || t > 8) && n.push(`${e}: expected an integer from 0 to 8`);
}, ke = (t, e, n) => {
  ve(t, e, n), typeof t == "number" && !Number.isInteger(t) && n.push(`${e}: expected an integer`);
}, Qe = (t, e, n) => {
  he(t, e, n), typeof t == "number" && !Number.isInteger(t) && n.push(`${e}: expected an integer`);
}, ut = (t, e, n) => {
  (typeof t != "string" || !t.trim()) && n.push(`${e}: expected a non-empty string`);
}, Ae = (t, e = 0, n = 1 / 0) => (s, a, o) => {
  if (!Array.isArray(s)) {
    o.push(`${a}: expected an array`);
    return;
  }
  (s.length < e || s.length > n) && o.push(`${a}: expected ${e}..${n} items`), s.forEach((i, c) => t(i, `${a}[${c}]`, o));
}, fe = Ae(he, 2, 2), we = (t, e, n) => {
  fe(t, e, n), Array.isArray(t) && t.length === 2 && t[0] >= t[1] && n.push(`${e}: start must be less than end`);
}, ue = (t, e = []) => (n, s, a) => {
  if (!n || typeof n != "object" || Array.isArray(n)) {
    a.push(`${s}: expected an object`);
    return;
  }
  const o = n;
  for (const [i, c] of Object.entries(t))
    o[i] === void 0 && e.includes(i) || c(o[i], `${s}.${i}`, a);
}, at = { cx: he, cy: he, rx: ve, ry: ve }, Be = ue(at), We = Ae(fe, 3), Ye = Ae(fe, 2), Ge = (t, e, n) => {
  he(t, e, n), typeof t == "number" && (t < 0 || t > 1) && n.push(`${e}: must be between 0 and 1`);
}, On = (t) => ue({
  version: (e, n, s) => {
    e !== 1 && s.push(`${n}: only version 1 is supported`);
  },
  image: ue({ width: ke, height: ke }),
  head: ue({
    ...at,
    shiftX: he,
    shiftY: he,
    pivotX: he,
    pivotY: he,
    maxRoll: he,
    weightBand: we,
    turnBand: we,
    weightOutline: We,
    weightFeather: ve
  }, ["weightOutline", "weightFeather"]),
  body: ue({
    pivotX: he,
    pivotY: he,
    maxRoll: he,
    breathBand: we,
    rollBand: we,
    chest: Be,
    shoulders: Ae(Be),
    hip: ue({ shift: he, band: we })
  }, ["hip"]),
  face: ue({
    nose: Be,
    mouth: Be,
    eyeA: Be,
    eyeB: Be,
    earL: Be,
    earR: Be,
    brow: ue({ ...at, band: we }),
    jaw: ue({ ...at, band: we })
  }),
  buns: ue({ bunL: Be, bunR: Be }, ["bunL", "bunR"]),
  eyes: Ae(ue({
    opening: We,
    roi: We,
    x0: he,
    x1: he,
    top: Ae(he, 24, 24),
    bot: Ae(he, 24, 24)
  }, t ? ["x0", "x1", "top", "bot"] : []), 2, 2),
  mouth: ue({
    cx: he,
    cy: he,
    angle: he,
    halfLen: ve,
    bow: he,
    area: ue({ ...at, angle: he })
  }),
  cheeks: Ae(fe, 2, 2),
  strands: Ae(ue({ name: ut, nodes: Ye, sigma: ve, k: ve, max: ve })),
  accessories: Ae(ue({
    name: ut,
    pivot: fe,
    tip: fe,
    split: Ge,
    box: Ae(Qe, 4, 4),
    color: ue({ redness: Ge, minRed: he })
  })),
  hand: ue({
    outline: We,
    jaw: Ye,
    jawRange: we,
    background: We,
    elbow: fe,
    wrist: fe,
    knuckle: fe,
    contact: fe,
    forearmShare: Ge,
    armBand: we,
    wristBand: we,
    handBand: we,
    fingerXBand: we,
    fingerYBand: we,
    pinBand: we
  }),
  cloth: Ae(ue({
    name: ut,
    outline: We,
    waist: Ye,
    hem: Ye,
    columns: ke,
    rows: ke,
    stiffness: ve,
    damping: ve,
    max: ve,
    tierGain: ve,
    highModeDamping: ve,
    responseGain: ve,
    swing: ve,
    follow: Ge,
    cohesion: kn,
    wind: Xe,
    behind: (e, n, s) => {
      typeof e != "boolean" && s.push(`${n}: expected a boolean`);
    },
    parent: ut,
    scale: ve,
    seams: Ae(Ye, 0, 64),
    tiers: Ae(Ye, 0, 8)
  }, ["tierGain", "highModeDamping", "seams", "tiers", "responseGain", "columns", "rows", "stiffness", "damping", "max", "swing", "follow", "cohesion", "wind", "behind", "parent", "scale"])),
  legs: ue({
    spine: Ge,
    bob: Xe,
    twist: Xe,
    pelvis: fe,
    shift: Xe,
    tilt: Xe,
    bend: Xe,
    band: we,
    split: Ye,
    left: ue({ hip: fe, knee: fe, ankle: fe }),
    right: ue({ hip: fe, knee: fe, ankle: fe })
  }, ["spine", "bob", "twist"]),
  arms: ue({
    swing: Xe,
    bend: Xe,
    inward: Ge,
    left: ue({ shoulder: fe, elbow: fe, wrist: fe, split: Ye }),
    right: ue({ shoulder: fe, elbow: fe, wrist: fe, split: Ye })
  }, ["swing", "bend", "inward"]),
  mesh: ue({
    baseCell: ke,
    fine: ue({
      x0: Qe,
      x1: Qe,
      y0: Qe,
      y1: Qe,
      cell: ke
    }),
    handCell: ke,
    tasselCell: ke,
    eyeBallCell: ke,
    eyeCell: ke,
    spriteCell: ke,
    clothCell: ke
  }, ["clothCell"]),
  view: ue({ padTop: he, padSide: he, gazeCenter: fe, irisTravel: ve }, ["gazeCenter", "irisTravel"])
}, ["buns", "strands", "accessories", "hand", "cloth", "legs", "arms"]);
function hn(t, e = {}) {
  const n = [];
  if (On(e.draft ?? !1)(t, "rig", n), n.length) return n;
  const s = t;
  s.eyes.forEach((o, i) => {
    const c = ["x0", "x1", "top", "bot"];
    if (!(e.draft && c.every((w) => o[w] === void 0))) {
      if (c.some((w) => o[w] === void 0)) {
        n.push(`rig.eyes[${i}]: supply all x0/x1/top/bot fields or omit all in a draft`);
        return;
      }
      o.x0 >= o.x1 && n.push(`rig.eyes[${i}].x1: must exceed x0`), o.top.some((w, y) => w > o.bot[y]) && n.push(`rig.eyes[${i}].top: must not exceed bottom curve`);
    }
  }), (s.mesh.fine.x0 >= s.mesh.fine.x1 || s.mesh.fine.y0 >= s.mesh.fine.y1) && n.push("rig.mesh.fine: rectangle must have positive area"), (s.view.padTop <= -1 || s.view.padTop >= 1 || s.view.padSide <= -0.5) && n.push("rig.view: margins must leave a positive viewport");
  for (const [o, i] of (s.strands ?? []).entries())
    i.nodes.some((c, w) => w > 0 && c[0] === i.nodes[w - 1][0] && c[1] === i.nodes[w - 1][1]) && n.push(`rig.strands[${o}].nodes: consecutive nodes must differ`);
  for (const [o, i] of (s.accessories ?? []).entries())
    (i.box[0] < 0 || i.box[1] < 0 || i.box[2] > s.image.width || i.box[3] > s.image.height) && n.push(`rig.accessories[${o}].box: rectangle must stay inside the image`), (i.split <= 0 || i.split >= 1) && n.push(`rig.accessories[${o}].split: must be strictly between 0 and 1`), i.pivot.every((c, w) => c === i.tip[w]) && n.push(`rig.accessories[${o}].tip: must differ from pivot`), (i.box[0] >= i.box[2] || i.box[1] >= i.box[3]) && n.push(`rig.accessories[${o}].box: rectangle must have positive area`);
  const a = /* @__PURE__ */ new Set();
  if (s.legs) {
    (s.legs.twist ?? 0) > 15 && n.push("rig.legs.twist: must be between 0 and 15 degrees");
    const o = s.legs;
    for (const i of ["left", "right"]) {
      const c = o[i];
      o.band[0] < c.hip[1] && c.hip[1] < c.knee[1] && c.knee[1] < c.ankle[1] || n.push(`rig.legs.${i}: require band start < hip y < knee y < ankle y`);
    }
    o.split.some((i, c) => c > 0 && i[1] <= o.split[c - 1][1]) && n.push("rig.legs.split: y coordinates must increase");
  }
  if (s.arms) {
    (s.arms.swing ?? 4) > 10 && n.push("rig.arms.swing: must be between 0 and 10 degrees"), (s.arms.bend ?? 6) > 12 && n.push("rig.arms.bend: must be between 0 and 12 degrees");
    for (const o of ["left", "right"]) {
      const i = s.arms[o], c = `rig.arms.${o}`;
      i.shoulder[1] < i.elbow[1] && i.elbow[1] < i.wrist[1] || n.push(`${c}: require shoulder y < elbow y < wrist y`);
      for (const [w, y] of Object.entries({ shoulder: [i.shoulder], elbow: [i.elbow], wrist: [i.wrist], split: i.split }))
        y.some(([g, h]) => g < 0 || h < 0 || g >= s.image.width || h >= s.image.height) && n.push(`${c}.${w}: points must stay inside the image`);
      if (i.split.some((w, y) => y > 0 && w[1] <= i.split[y - 1][1]))
        n.push(`${c}.split: y coordinates must increase`);
      else {
        const w = (y) => {
          let g = 0;
          for (; g < i.split.length - 2 && y > i.split[g + 1][1]; ) g++;
          const h = i.split[g], m = i.split[g + 1], f = Math.max(0, Math.min(1, (y - h[1]) / (m[1] - h[1])));
          return h[0] + (m[0] - h[0]) * f;
        };
        [i.elbow, i.wrist].some(([y, g]) => o === "left" ? w(g) <= y : w(g) >= y) && n.push(`${c}.split: must lie on the body side of elbow and wrist`);
      }
    }
  }
  for (const [o, i] of (s.cloth ?? []).entries()) {
    if ((!/^[A-Za-z0-9_-]+$/.test(i.name) || a.has(i.name)) && n.push(`rig.cloth[${o}].name: must be a unique layer-safe name`), i.parent !== void 0 && !a.has(i.parent) && n.push(`rig.cloth[${o}].parent: must name an earlier cloth entry`), ((i.columns ?? 2) < 2 || (i.rows ?? 2) < 2) && n.push(`rig.cloth[${o}]: columns and rows must be at least 2`), i.seams?.length === 1 && n.push(`rig.cloth[${o}].seams: at least two columns required`), i.seams?.length || i.tiers?.length) {
      i.seams?.some((c) => c.some((w, y) => y > 0 && w[1] <= c[y - 1][1])) && n.push(`rig.cloth[${o}].seams: y must increase from waist to hem`);
      try {
        ln(i);
      } catch (c) {
        n.push(`rig.cloth[${o}]: ${c instanceof Error ? c.message : String(c)}`);
      }
    }
    a.add(i.name);
  }
  return n;
}
function Yt(t) {
  const e = hn(t);
  if (e.length) throw new Error(`Invalid rig:
${e.join(`
`)}`);
  return structuredClone(t);
}
const Rn = (t, e, n) => {
  const s = Math.min(1, Math.max(0, (n - t) / (e - t)));
  return s * s * (3 - 2 * s);
}, Fn = 16;
function un(t) {
  const e = t?.weightOutline;
  if (!Array.isArray(e) || e.length < 3) return null;
  const n = Number.isFinite(t.weightFeather) && t.weightFeather > 0 ? t.weightFeather : Fn;
  function s(a, o) {
    let i = !1, c = 1 / 0;
    for (let w = 0, y = e.length - 1; w < e.length; y = w++) {
      const [g, h] = e[y], [m, f] = e[w];
      h > o != f > o && a < g + (o - h) * (m - g) / (f - h) && (i = !i);
      const l = m - g, p = f - h, u = Math.min(1, Math.max(0, ((a - g) * l + (o - h) * p) / (l * l + p * p || 1)));
      c = Math.min(c, Math.hypot(a - g - l * u, o - h - p * u));
    }
    return i ? 0 : c;
  }
  return (a, o) => 1 - Rn(0, n, s(a, o));
}
const Ve = (t, e, n) => Math.max(e, Math.min(n, t)), Re = (t, e, n) => {
  const s = Ve((n - t) / (e - t), 0, 1);
  return s * s * (3 - 2 * s);
}, gt = (t, e) => Math.hypot(t[0] - e[0], t[1] - e[1]), ct = (t, e, n) => {
  const s = t[0] - e[0], a = t[1] - e[1], o = Math.cos(n), i = Math.sin(n);
  return [e[0] + s * o - a * i, e[1] + s * i + a * o];
};
function Nt(t, e, n, s) {
  const a = gt(t, e), o = gt(n, s), i = (e[0] - t[0]) / a, c = (e[1] - t[1]) / a, w = (s[0] - n[0]) / o, y = (s[1] - n[1]) / o, g = o / a, h = [
    w * g * i + y * c,
    w * g * c - y * i,
    y * g * i - w * c,
    y * g * c + w * i
  ];
  return [...h, n[0] - h[0] * t[0] - h[1] * t[1], n[1] - h[2] * t[0] - h[3] * t[1]];
}
const Dt = (t, e) => [e[0] * t[0] + e[1] * t[1] + e[4], e[2] * t[0] + e[3] * t[1] + e[5]], vt = Object.freeze({ spine: 0.7, bob: 2, twist: 0 });
function _n(t, e, n = null) {
  if (!t) return null;
  const s = [t.left, t.right].map((B, j) => {
    const Y = gt(B.hip, B.knee), P = gt(B.knee, B.ankle), N = Math.min(Y, P) * 0.05, q = Math.hypot(Y, N), ae = Math.hypot(P, N), J = B.ankle[0] - B.hip[0], $ = B.ankle[1] - B.hip[1], ee = J * (B.knee[1] - B.hip[1]) - $ * (B.knee[0] - B.hip[0]);
    return { ...B, u: q, v: ae, depth: N, lateral: ee / Math.hypot(J, $), side: Math.sign(ee) || (j ? 1 : -1) };
  }), a = un(n), o = (t.twist ?? 0) > 0, i = (t.twist ?? 0) * Math.PI / 180, c = Math.max(1, ...s.map((B) => Math.abs(B.hip[0] - t.pelvis[0]) * 1.35)), w = Math.max(e.chest.rx, ...e.shoulders.map((B) => Math.abs(B.cx - e.chest.cx) + B.rx)), y = [0, 0], g = [0, 0];
  let h = 0;
  const m = (B, j, Y, P) => {
    const N = B - j, q = Math.max(0, 1 - (N / Y) ** 2);
    return N * (Math.cos(P) - 1) + Y * 0.75 * q * q * Math.sin(P);
  }, f = [0, 0, 0], l = [0, 0, 0];
  let p = 0, u = 0, v = 0, r = 0, d;
  function x(B, j) {
    const Y = Ve(B.weightShift ?? 0, -1, 1), P = Math.min(Math.max(j, 0), 0.05), N = g[0], q = o ? i * Ve(0.4 * Y + (P ? 0.6 * Math.tanh((Y - v) / P) : 0), -1, 1) : 0;
    if (!P)
      o && (y.fill(q), g.fill(0), h = 0), f.fill(Y), l.fill(0), p = 0, u = 0;
    else {
      const ae = (t.bob ?? vt.bob) * Math.min(1, Math.abs(Y - v) / P / 1.5), J = Math.ceil(P * 240), $ = P / J;
      for (let ee = 0; ee < J; ee++) {
        for (let Z = 0; Z < 3; Z++) {
          const se = Z ? f[Z - 1] : Y;
          l[Z] += (576 * (se - f[Z]) - 2 * 0.9 * 24 * l[Z]) * $, f[Z] += l[Z] * $;
        }
        if (o) for (let Z = 0; Z < 2; Z++) {
          const se = Z ? y[0] : q;
          g[Z] += (196 * (se - y[Z]) - 2 * 0.95 * 14 * g[Z]) * $, y[Z] += g[Z] * $;
        }
        u += (576 * (ae - p) - 2 * 0.9 * 24 * u) * $, p += u * $;
      }
    }
    o && P && (h = (g[0] - N) / P), v = Y, r++;
  }
  const b = Math.min(...s.map((B) => B.ankle[1]));
  let A, F, U;
  function ne(B) {
    const j = Ve(B.weightShift ?? 0, -1, 1), Y = Ve(B.bodyAngleX ?? 0, -10, 10);
    if (j === A && Y === F && r === d) return U;
    A = j, F = Y, d = r;
    const P = -t.tilt * j, N = t.shift * j + Y / 10 * (e.hip?.shift ?? t.shift), q = o ? r ? y[0] : i * 0.4 * j : 0, ae = o ? -(1 - (t.spine ?? vt.spine)) * (r ? y[1] : q) : 0, J = (z) => {
      const M = ct(z, t.pelvis, P);
      return o && (M[0] += m(z[0], t.pelvis[0], c, q)), M[0] += N, M;
    }, $ = s.map((z) => J(z.hip)), ee = s.map((z, M) => z.lateral + z.side * t.bend * Math.max(0, M ? -j : j) ** 2), Z = j * j + (Y / 10) ** 2, se = t.bend ** 2 / Math.min(...s.map((z) => z.u + z.v)) * Z, re = (z) => (z + Math.hypot(z, se)) / 2;
    let te = p + t.bend ** 2 / Math.min(...s.map((z) => z.u + z.v)) * j * j;
    for (let z = 0; z < s.length; z++) {
      const M = s[z], T = $[z], S = T[0] - M.ankle[0], L = Math.sqrt(Math.max(0, M.u * M.u - ee[z] ** 2)) + Math.sqrt(Math.max(0, M.v * M.v - ee[z] ** 2)), _ = M.ankle[1] - Math.sqrt(Math.max(0, L * L - S * S)) - T[1];
      te += re(_ - te);
    }
    const oe = s.map((z, M) => {
      const T = [$[M][0], $[M][1] + te], S = z.ankle;
      if (!j && !Y && !p && !q) return {
        hip: z.hip,
        knee: z.knee,
        ankle: S,
        hip3: [...z.hip, 0],
        knee3: [...z.knee, z.depth],
        ankle3: [...S, 0],
        upper: [1, 0, 0, 1, 0, 0],
        lower: [1, 0, 0, 1, 0, 0]
      };
      const L = S[0] - T[0], _ = S[1] - T[1], D = Math.hypot(L, _), O = (z.u * z.u - z.v * z.v + D * D) / (2 * D), W = Math.sqrt(Math.max(0, z.u * z.u - O * O)), H = [
        T[0] + L / D * O - _ / D * ee[M],
        T[1] + _ / D * O + L / D * ee[M]
      ], E = Math.sqrt(Math.max(0, W * W - ee[M] ** 2));
      return {
        hip: T,
        knee: H,
        ankle: S,
        hip3: [...T, 0],
        knee3: [...H, E],
        ankle3: [...S, 0],
        upper: Nt(z.hip, z.knee, T, H),
        lower: Nt(z.knee, z.ankle, H, S)
      };
    });
    return U = {
      ws: j,
      bx: Y,
      angle: P,
      shift: N,
      drop: te,
      bones: oe,
      ...o && { twist: { pelvis: q, shoulder: ae, head: 0, acceleration: h } },
      trunk: { spine: f[0], chest: f[1], head: f[2], bob: p }
    }, U;
  }
  function X(B) {
    const j = t.split;
    let Y = 0;
    for (; Y < j.length - 2 && B > j[Y + 1][1]; ) Y++;
    const P = j[Y], N = j[Y + 1], q = Ve((B - P[1]) / (N[1] - P[1]), 0, 1);
    return P[0] + (N[0] - P[0]) * q;
  }
  function G(B, j) {
    const Y = j >= t.split[0][1] ? +(B >= X(j)) : Re(X(j) - 4, X(j) + 4, B), P = s.map((N) => ({
      leg: Re(t.band[0], N.hip[1], j),
      shin: Re(N.knee[1] - 45, N.knee[1] + 45, j),
      pin: 1 - Re(N.ankle[1] - 55, N.ankle[1], j)
    }));
    return a ? { right: Y, perBone: P, headSide: a(B, j) } : { right: Y, perBone: P };
  }
  function R(B, j, Y, P, N) {
    const q = ne(N);
    if (!q.ws && !q.bx && !q.trunk.chest && !q.trunk.head && !p && !q.twist?.pelvis && !q.twist?.shoulder) return;
    const ae = [t.pelvis[0] + q.shift, t.pelvis[1] + q.drop], J = 1 - Re(Math.min(e.chest.cy, t.pelvis[1] - 1), t.pelvis[1], Y), $ = 1 - Re(...t.band, Y), ee = t.spine ?? vt.spine, Z = t.tilt * (1 - ee) * q.trunk.chest, se = t.shift * (1.12 * q.trunk.chest - q.ws) + Math.sin(Z) * Math.max(0, t.pelvis[1] - e.chest.cy), re = (T) => {
      const S = ct(T, t.pelvis, q.angle);
      S[0] += q.shift, S[1] += q.drop;
      const L = ct(S, ae, (Z - q.angle) * $);
      return L[0] += se * J, L;
    }, te = re(B), oe = P.headSide ?? 1;
    if (n) {
      const T = (1 - Re(...n.weightBand, Y)) * oe, S = re([n.pivotX, n.pivotY]), L = -t.tilt * (1 - ee) * q.trunk.head * T, _ = ct(te, S, L);
      te[0] = _[0] + t.shift * 1.12 * (q.trunk.head - q.trunk.chest) * T, te[1] = _[1];
    }
    if (o) {
      const T = e.chest.cy + Math.max(40, (t.pelvis[1] - e.chest.cy) * 0.5), S = Re(e.chest.cy, T, Y), L = q.twist.shoulder + (q.twist.pelvis - q.twist.shoulder) * S, _ = e.chest.cx + (t.pelvis[0] - e.chest.cx) * S, D = w + (c - w) * S, O = n ? oe === 1 ? Re(...n.weightBand, Y) : 1 - (1 - Re(...n.weightBand, Y)) * oe : 1;
      te[0] += m(j, _, D, L) * O;
    }
    let z = 0, M = 0;
    s.forEach((T, S) => {
      const L = q.bones[S], _ = P.perBone[S], D = Dt(B, L.upper), O = Dt(B, L.lower), W = D[0] + (O[0] - D[0]) * _.shin, H = D[1] + (O[1] - D[1]) * _.shin, E = S ? P.right : 1 - P.right;
      z += ((te[0] - B[0]) * (1 - _.leg) + (W - B[0]) * _.leg) * _.pin * E, M += ((te[1] - B[1]) * (1 - _.leg) + (H - B[1]) * _.leg) * _.pin * E;
    }), B[0] += z, B[1] += M;
  }
  function I(B) {
    return 1 - Re(b - 55, b, B);
  }
  return { frame: ne, weights: G, apply: R, pin: I, step: x };
}
const De = (t, e, n) => Math.max(e, Math.min(n, t)), et = (t, e = 0) => Number.isFinite(t) ? t : e, tt = (t, e, n) => {
  const s = De((n - t) / Math.max(1e-6, e - t), 0, 1);
  return s * s * (3 - 2 * s);
}, wt = (t, e, n) => {
  const s = t[0] - e[0], a = t[1] - e[1], o = Math.cos(n), i = Math.sin(n);
  return [e[0] + s * o - a * i, e[1] + s * i + a * o];
}, rt = Object.freeze({ swing: 4, bend: 6, inward: 0.4 });
function Bn(t, e, n = null) {
  if (!t) return null;
  const s = De(et(t.swing, rt.swing), 0, 10) * Math.PI / 180, a = De(et(t.bend, rt.bend), 0, 12) * Math.PI / 180, o = De(et(t.inward, rt.inward), 0, 1), i = [t.left, t.right];
  function c(h, m) {
    let f = 0;
    for (; f < h.length - 2 && m > h[f + 1][1]; ) f++;
    const l = h[f], p = h[f + 1], u = De((m - l[1]) / Math.max(1e-6, p[1] - l[1]), 0, 1);
    return l[0] + (p[0] - l[0]) * u;
  }
  function w(h, m) {
    return i.map((f, l) => {
      const p = Math.max(1, f.elbow[1] - f.shoulder[1]), u = Math.max(1, f.wrist[1] - f.elbow[1]), v = Math.max(1, Math.min(p, u, e.chest.ry) * 0.2), r = c(f.split, m), d = l ? h - r : r - h, x = +(d >= 0), b = tt(-v, v, d), A = tt(f.split[0][1] - v, f.split[0][1], m);
      return {
        arm: (b + (x - b) * A) * tt(f.shoulder[1], f.shoulder[1] + p * 0.55, m) * (1 - tt(f.split.at(-1)[1], f.split.at(-1)[1] + v, m)),
        forearm: tt(f.elbow[1] - v, f.elbow[1] + v, m)
      };
    });
  }
  function y(h, m = (f) => [...f]) {
    return i.map((f, l) => {
      const p = l ? "R" : "L", u = l ? -1 : 1, v = De(et(h[`armSwing${p}`]), -1, 1);
      return {
        shoulder: m(f.shoulder),
        elbow: m(f.elbow),
        swing: u * s * v * (v < 0 ? o : 1),
        // Flex inward; negative values never hyper-extend the elbow.
        bend: -u * a * De(et(h[`elbowBend${p}`]), 0, 1)
      };
    });
  }
  function g(h, m, f, l, p, u = y(p)) {
    const v = [...h];
    u.forEach((r, d) => {
      if (!l[d].arm || !r.swing && !r.bend) return;
      const x = r.swing ? wt(v, r.shoulder, r.swing) : v, b = r.swing ? wt(r.elbow, r.shoulder, r.swing) : r.elbow, A = r.bend ? wt(x, b, r.bend) : x;
      h[0] += (x[0] - v[0] + (A[0] - x[0]) * l[d].forearm) * l[d].arm, h[1] += (x[1] - v[1] + (A[1] - x[1]) * l[d].forearm) * l[d].arm;
    });
  }
  return { weights: w, frame: y, apply: g };
}
const mt = [
  { id: "angleX", label: "Face angle X", min: -30, max: 30, def: 0, group: "Head and body" },
  { id: "angleY", label: "Face angle Y", min: -30, max: 30, def: 0, group: "Head and body" },
  { id: "angleZ", label: "Face roll", min: -30, max: 30, def: 0, group: "Head and body" },
  { id: "bodyAngleX", label: "Body angle X", min: -10, max: 10, def: 0, group: "Head and body" },
  { id: "bodyAngleZ", label: "Body roll", min: -10, max: 10, def: 0, group: "Head and body" },
  { id: "breath", label: "Breath", min: 0, max: 1, def: 0, group: "Head and body" },
  { id: "eyeLOpen", label: "Left eye open", min: 0, max: 1.25, def: 1, group: "Eyes and brows" },
  { id: "eyeROpen", label: "Right eye open", min: 0, max: 1.25, def: 1, group: "Eyes and brows" },
  { id: "eyeSmile", label: "Eye smile", min: 0, max: 1, def: 0, group: "Eyes and brows" },
  { id: "gazeX", label: "Gaze X", min: -1, max: 1, def: 0, group: "Eyes and brows" },
  { id: "gazeY", label: "Gaze Y", min: -1, max: 1, def: 0, group: "Eyes and brows" },
  { id: "browY", label: "Brow Y", min: -1, max: 1, def: 0, group: "Eyes and brows" },
  { id: "browAngle", label: "Brow angle", min: -1, max: 1, def: 0, group: "Eyes and brows" },
  { id: "mouthOpen", label: "Mouth open", min: 0, max: 1, def: 0, group: "Mouth and cheeks" },
  { id: "mouthForm", label: "Mouth form (i to o)", min: -1, max: 1, def: 0, group: "Mouth and cheeks" },
  { id: "blush", label: "Blush", min: 0, max: 1, def: 0, group: "Mouth and cheeks" },
  { id: "armAngle", label: "Arm angle", min: -10, max: 10, def: 0, group: "Hand" },
  { id: "handAngle", label: "Wrist angle", min: -10, max: 10, def: 0, group: "Hand" },
  { id: "fingerTap", label: "Finger tap", min: 0, max: 1, def: 0, group: "Hand" },
  { id: "weightShift", label: "Weight shift", min: -1, max: 1, def: 0, group: "Legs" },
  ...["L", "R"].flatMap((t) => [
    { id: `armSwing${t}`, label: `Arm swing ${t}`, min: -1, max: 1, def: 0, group: "Arms" },
    { id: `elbowBend${t}`, label: `Elbow bend ${t}`, min: 0, max: 1, def: 0, group: "Arms" }
  ])
];
function $n(t) {
  const e = { w: t.image.width, h: t.image.height }, n = (M, T, S) => S ? Math.exp(-(((M - S.cx) / S.rx) ** 2 + ((T - S.cy) / S.ry) ** 2)) : 0, s = 24, a = t.eyes;
  function o(M, T) {
    const S = Math.min(1, Math.max(0, T)) * (s - 1), L = Math.min(Math.floor(S), s - 2), _ = S - L;
    return M[L] + (M[L + 1] - M[L]) * _;
  }
  function i(M, T, S, L) {
    T = Math.min(1, Math.max(0, T));
    const _ = o(M.top, T), D = o(M.bot, T), O = 1 - S, W = 4 * T * (1 - T), H = o(M.bot, 0.5) - o(M.top, 0.5), E = M.top[0] + (M.top[s - 1] - M.top[0]) * T - 0.3 * H * W, k = Math.max(_, D + 1 + (E - D - 1) * L);
    return [(k - _) * Math.max(O, -0.07), O > 0 ? (k - D) * O * L : 0];
  }
  const c = [[-2, 1], [-1, 2], [0, 3], [1, 2], [2, 1]], w = 5;
  function y(M, T, S, L) {
    let _ = 0, D = 0;
    for (const [E, k] of c) {
      const [C, V] = i(M, (T + E * w - M.x0) / (M.x1 - M.x0), S, L);
      _ += C * k / 9, D += V * k / 9;
    }
    const O = Math.min(1, Math.max(0, (T - M.x0) / (M.x1 - M.x0))), W = o(M.top, O), H = o(M.bot, O);
    return { top: W, bot: H, b: 1 - S, lid: W + _, bc: H + D };
  }
  function g(M, T, S, L, _, D) {
    const O = y(M, S, _, D);
    return T === "lash" ? O.lid - (O.top - L) * (1 - 0.3 * Math.min(1, Math.max(0, O.b))) : T === "low" ? L + (O.bc - O.bot) : T === "crease" ? L + (O.lid - O.top) * 0.22 : L;
  }
  function h(M, T, S) {
    const L = Math.min(1, Math.max(0, 1 - T));
    return M === "low" ? 1 - Math.min(1, L * S * 1.2) : M === "crease" ? 1 - 0.45 * L : 1;
  }
  const m = t.mouth, f = t.cheeks, l = t.head, p = t.body, u = _n(t.legs, p, l), v = Bn(t.arms, p, t.legs), r = (M, T, S) => {
    const L = Math.min(1, Math.max(0, (S - M) / (T - M)));
    return L * L * (3 - 2 * L);
  }, d = un(l) ?? (() => 1);
  function x(M, T) {
    return (1 - r(...l.weightBand, T)) * d(M, T);
  }
  function b(M, T) {
    return (1 - r(...l.turnBand, T)) * d(M, T);
  }
  const A = t.strands ?? [];
  function F(M, T, S) {
    let L = 1 / 0, _ = 0;
    const D = S.length - 1;
    for (let O = 0; O < D; O++) {
      const [W, H] = S[O], [E, k] = S[O + 1], C = E - W, V = k - H, Q = Math.min(1, Math.max(0, ((M - W) * C + (T - H) * V) / (C * C + V * V))), ie = Math.hypot(M - W - C * Q, T - H - V * Q);
      ie < L && (L = ie, _ = (O + Q) / D);
    }
    return [L, _];
  }
  function U(M, T, S) {
    if (S < 0.02) return [];
    const L = [];
    let _ = 0;
    A.forEach((O, W) => {
      const [H, E] = F(M, T, O.nodes), k = Math.exp(-((H / O.sigma) ** 2));
      k < 0.02 || (L.push([W, k, E]), _ += k);
    });
    const D = Math.max(1, _);
    return L.map(([O, W, H]) => [O, S * W / D * r(0.04, 0.55, H), H]);
  }
  function ne(M, T, S = 1) {
    return {
      head: x(M, T),
      turn: b(M, T),
      strands: U(M, T, S),
      bunL: n(M, T, t.buns?.bunL),
      bunR: n(M, T, t.buns?.bunR),
      brow: n(M, T, t.face.brow) * (1 - r(...t.face.brow.band, T)),
      // chin below the mouth line drops a little when the mouth opens
      jaw: n(M, T, t.face.jaw) * r(...t.face.jaw.band, T),
      // per-feature depth for head turns (nose sticks out most, ears sit at the back)
      nose: n(M, T, t.face.nose),
      mouth: n(M, T, t.face.mouth),
      eyeA: n(M, T, t.face.eyeA),
      eyeB: n(M, T, t.face.eyeB),
      earR: n(M, T, t.face.earR),
      earL: n(M, T, t.face.earL),
      chest: n(M, T, p.chest),
      breath: 1 - r(...p.breathBand, T),
      shoulder: p.shoulders.reduce((L, _) => L + n(M, T, _), 0),
      ...u && { legs: u.weights(M, T) },
      ...v && { arms: v.weights(M, T) }
    };
  }
  function X(M, T, S, L) {
    const _ = (M - l.cx) / l.rx, D = (T - l.cy) / l.ry, O = 1 - _ * _ - D * D;
    if (O <= 0) return [0, 0];
    const W = r(0, 0.84, O);
    return [S * l.shiftX * W, -L * l.shiftY * W];
  }
  function G(M, T, S, L) {
    const _ = Math.cos(L), D = Math.sin(L), O = M[0] - T, W = M[1] - S;
    M[0] = T + O * _ - W * D, M[1] = S + O * D + W * _;
  }
  function R(M, T, S, L = T) {
    const _ = X(M[0], M[1], S.angleX / 30, S.angleY / 30);
    M[0] += _[0] * L, M[1] += _[1] * L, !(T <= 0) && G(M, l.pivotX, l.pivotY, -S.angleZ / 30 * l.maxRoll * T);
  }
  function I(M, T, S, L = 0, _ = 1, D = 0, O) {
    u && u.apply(M, M[0], T, O ?? u.weights(M[0], T), S);
    const W = M[0], H = M[1], E = S.breath;
    M[1] -= E * (5 * _ + 4 * D), M[0] += (M[0] - p.chest.cx) * 0.012 * E * L;
    const k = p.hip;
    if (u || (M[0] += S.bodyAngleX / 10 * (k ? k.shift * (1 - r(...k.band, T)) : 7 + 9 * L)), G(M, p.pivotX, p.pivotY, -S.bodyAngleZ / 10 * p.maxRoll * (1 - r(...p.rollBand, T))), u) {
      const C = u.pin(T);
      M[0] = W + (M[0] - W) * C, M[1] = H + (M[1] - H) * C;
    }
  }
  let B, j;
  function Y(M, T, S, L, _, D) {
    const O = D;
    if (O[0] = M, O[1] = T, u && !u.pin(T)) return O;
    const W = _.gain;
    for (const [k, C, V] of S.strands) {
      const Q = _.strands?.[k];
      if (!Q) continue;
      const ie = V * 3, ce = Math.min(2, Math.floor(ie)), ge = ie - ce;
      O[0] += (Q[ce][0] + (Q[ce + 1][0] - Q[ce][0]) * ge) * C * W, O[1] += (Q[ce][1] + (Q[ce + 1][1] - Q[ce][1]) * ge) * C * W;
    }
    if (O[0] += (_.bunL[0] * S.bunL + _.bunR[0] * S.bunR) * W, O[1] += (_.bunL[1] * S.bunL + _.bunR[1] * S.bunR) * W, O[1] -= L.browY * 7 * S.brow, S.brow > 0.01) {
      const k = L.browAngle * 0.12 * S.brow;
      O[1] += (M - t.face.brow.cx) * Math.sin(k);
    }
    O[1] += L.mouthOpen * 3.5 * S.jaw;
    const H = L.angleX / 30, E = L.angleY / 30;
    if (O[0] += H * (8 * S.nose + 5 * S.mouth) + (M - t.face.eyeA.cx) * 0.12 * H * S.eyeA - (M - t.face.eyeB.cx) * 0.12 * H * S.eyeB - H * 9 * S.earR + H * 4 * S.earL - H * 10 * (S.bunL + S.bunR), O[1] -= E * (6 * S.nose + 3 * S.mouth), O[1] += (T - t.face.eyeA.cy) * -0.06 * Math.abs(E) * S.eyeA + (T - t.face.eyeB.cy) * -0.06 * Math.abs(E) * S.eyeB, R(O, S.head, L, S.turn), I(O, T, L, S.chest, S.breath, S.shoulder, S.legs), v && S.arms.some((k) => k.arm > 0)) {
      const k = [
        L.angleX,
        L.angleY,
        L.angleZ,
        L.bodyAngleX,
        L.bodyAngleZ,
        L.breath,
        L.armSwingL,
        L.armSwingR,
        L.elbowBendL,
        L.elbowBendR,
        u?.frame(L)
      ];
      (!B || k.some((C, V) => C !== B[V])) && (B = k, j = v.frame(L, (C) => {
        const V = [...C], Q = ne(...C, 0);
        return R(V, Q.head, L, Q.turn), I(V, C[1], L, Q.chest, Q.breath, Q.shoulder, Q.legs), V;
      })), v.apply(O, M, T, S.arms, L, j);
    }
    return O;
  }
  const P = t.hand, N = P?.elbow ?? [0, 0], q = P?.wrist ?? [0, 0], ae = P?.knuckle ?? [0, 0], J = P?.contact ?? [0, 0], $ = P?.forearmShare ?? 0;
  function ee(M, T) {
    return P ? {
      arm: 1 - r(...P.armBand, T),
      wrist: 1 - r(...P.wristBand, T),
      hand: 1 - r(...P.handBand, T),
      finger: r(...P.fingerXBand, M) * (1 - r(...P.fingerYBand, T)),
      pinBottom: r(...P.pinBand, T)
    } : { arm: 0, wrist: 0, hand: 0, finger: 0, pinBottom: 0 };
  }
  const Z = (M, T, S, L) => {
    const _ = M[0] - T[0], D = M[1] - T[1];
    return [T[0] + _ * S - D * L, T[1] + _ * L + D * S];
  }, se = (M) => Math.atan2(M[1], M[0]);
  function re(M) {
    const T = [...J];
    R(T, x(...J), M, b(...J)), I(T, J[1], M, 0, 1, 0);
    const S = [...N];
    I(S, N[1], M, 0, 0, 0);
    const L = (se([T[0] - S[0], T[1] - S[1]]) - se([J[0] - N[0], J[1] - N[1]])) * $, _ = Math.cos(L), D = Math.sin(L), O = (C) => {
      const V = Z(C, N, _, D);
      return [V[0] + S[0] - N[0], V[1] + S[1] - N[1]];
    }, W = O(q), H = O(J), E = se([T[0] - W[0], T[1] - W[1]]) - se([H[0] - W[0], H[1] - W[1]]), k = Math.min(1.03, Math.max(0.97, Math.hypot(T[0] - W[0], T[1] - W[1]) / Math.hypot(H[0] - W[0], H[1] - W[1])));
    return { tr: O, w: W, b: E, k };
  }
  function te(M, T, S, L, _, D) {
    let O = [M, T];
    O = Z(O, ae, Math.cos(L.fingerTap * 0.07 * S.finger), Math.sin(L.fingerTap * 0.07 * S.finger));
    const W = -L.handAngle / 10 * 0.045 * S.wrist, H = -L.armAngle / 10 * 0.015 * S.arm;
    O = Z(O, q, Math.cos(W), Math.sin(W)), O = Z(O, N, Math.cos(H), Math.sin(H)), O = _.tr(O);
    const E = _.b * S.hand, k = 1 + (_.k - 1) * S.hand;
    return O = Z(O, _.w, Math.cos(E) * k, Math.sin(E) * k), O[1] += (T - O[1]) * S.pinBottom, D[0] = O[0], D[1] = O[1], D;
  }
  const oe = t.accessories ?? [];
  function z(M, T, S, L) {
    const _ = ne(M.pivot[0], M.pivot[1]);
    return Y(M.pivot[0], M.pivot[1], _, T, S, L);
  }
  return { legs: u, stepBody: (M, T) => u?.step(M, T), IMG: e, EYES: a, MOUTH: m, CHEEKS: f, STRANDS: A, TASSELS: oe, headWeight: x, turnWeight: b, baseWeights: ne, deformBase: Y, applyHead: R, applyBody: I, handWeights: ee, handFrame: re, deformHand: te, eyePartY: g, eyePartAlpha: h, tasselAnchor: z };
}
function jn(t, e, n, s = !1) {
  const a = s ? Math.max(e, n) * 2 : 1, o = new Float32Array(t.length), i = Math.SQRT2;
  for (let c = 0; c < n; c++) for (let w = 0; w < e; w++) {
    const y = c * e + w;
    t[y] <= 3 || (o[y] = Math.min(
      w ? o[y - 1] + 1 : a,
      c ? o[y - e] + 1 : a,
      w && c ? o[y - e - 1] + i : a,
      c && w + 1 < e ? o[y - e + 1] + i : a
    ));
  }
  for (let c = n - 1; c >= 0; c--) for (let w = e - 1; w >= 0; w--) {
    const y = c * e + w;
    !t[y] || t[y] <= 3 || (o[y] = Math.min(
      o[y],
      w + 1 < e ? o[y + 1] + 1 : a,
      c + 1 < n ? o[y + e] + 1 : a,
      w && c + 1 < n ? o[y + e - 1] + i : a,
      w + 1 < e && c + 1 < n ? o[y + e + 1] + i : a
    ));
  }
  return o;
}
function xt(t, e, n) {
  return Math.exp(-(((t - n.cx) / n.rx) ** 2 + ((e - n.cy) / n.ry) ** 2));
}
function Yn(t, e, n) {
  const s = ((t - n.head.cx) / n.head.rx) ** 2 + ((e - n.head.cy) / n.head.ry) ** 2;
  let a = n.head.rx * 0.8 * Math.sqrt(Math.max(0, 1 - s)) + n.body.chest.rx * 0.23 * xt(t, e, n.body.chest);
  a += n.face.nose.rx * 0.2 * xt(t, e, n.face.nose);
  for (const [o, i] of n.cheeks) a += n.head.rx * 0.012 * xt(t, e, { cx: o, cy: i, rx: n.head.rx * 0.3, ry: n.head.ry * 0.16 });
  return a;
}
function yt(t, e, n, s) {
  const a = new Float32Array(t.length), o = new Float32Array(t.length), i = (c, w, y, g, h, m) => {
    for (let f = 0; f < g; f++) {
      const l = f * m;
      let p = 0, u = 0;
      for (let v = 0; v < Math.min(s, y - 1) + 1; v++)
        p += c[l + v * h], u++;
      for (let v = 0; v < y; v++) {
        w[l + v * h] = p / u;
        const r = v + s + 1, d = v - s;
        r < y && (p += c[l + r * h], u++), d >= 0 && (p -= c[l + d * h], u--);
      }
    }
  };
  return i(t, a, e, n, 1, e), i(a, o, n, e, e, 1), o;
}
function Un(t, e, n, s) {
  const a = yt(t, n, s, 1), o = yt(t, n, s, 6), i = new Float32Array(t.length);
  for (let y = 0; y < i.length; y++) i[y] = e[y] > 128 ? a[y] - o[y] : 0;
  const c = new Float32Array(t.length * 2), w = (y, g) => i[Math.max(0, Math.min(s - 1, g)) * n + Math.max(0, Math.min(n - 1, y))];
  for (let y = 0; y < s; y++) for (let g = 0; g < n; g++) {
    const h = y * n + g;
    e[h] <= 128 || (c[2 * h] = Math.max(-1, Math.min(1, -(w(g + 1, y) - w(g - 1, y)) * 4)), c[2 * h + 1] = Math.max(-1, Math.min(1, -(w(g, y + 1) - w(g, y - 1)) * 4)));
  }
  return c;
}
function Xn(t, e, n, s, a, o = !0, i) {
  const c = !!a && s[0] === 0 && s[1] === 0 && s[2] === a.image.width && s[3] === a.image.height, w = jn(t, e, n, c), y = new Float32Array(t.length), g = s[2] / e, h = s[3] / n, m = Math.min(g, h), f = Math.min(s[2], s[3]) * 0.08;
  for (let r = 0; r < n; r++) for (let d = 0; d < e; d++) {
    const x = r * e + d;
    y[x] = (o ? Math.sqrt(w[x] * m * f) * 0.55 : 0) + (a ? Yn(s[0] + (d + 0.5) * g, s[1] + (r + 0.5) * h, a) : 0);
  }
  const l = Math.max(1, Math.round(Math.min(e, n) * 0.02));
  y.set(yt(yt(y, e, n, l), e, n, l));
  const p = i ? Un(i, t, e, n) : null, u = new Uint8Array(e * n * 4), v = (r, d) => y[Math.max(0, Math.min(n - 1, d)) * e + Math.max(0, Math.min(e - 1, r))];
  for (let r = 0; r < n; r++) for (let d = 0; d < e; d++) {
    const x = -(v(d + 2, r) - v(d - 2, r)) / (4 * g), b = -(v(d, r + 2) - v(d, r - 2)) / (4 * h), A = Math.hypot(x, b, 1), F = (r * e + d) * 4, U = r * e + d;
    u[F] = Math.round((x / A * 0.5 + 0.5) * 255), u[F + 1] = Math.round((b / A * 0.5 + 0.5) * 255), u[F + 2] = Math.round(((p?.[2 * U] ?? 0) * 0.5 + 0.5) * 255), u[F + 3] = Math.round(((p?.[2 * U + 1] ?? 0) * 0.5 + 0.5) * 255);
  }
  return u;
}
const Zt = /* @__PURE__ */ new WeakMap();
function zn(t, e, n, s) {
  const a = JSON.stringify([e, n.head, n.body.chest, n.face.nose, n.cheeks, s]), o = Zt.get(t);
  if (o?.key === a) return { ...o, computed: !1, ms: 0 };
  const i = performance.now(), c = Math.min(1, 512 / Math.max(t.width, t.height)), w = Math.max(1, Math.round(t.width * c)), y = Math.max(1, Math.round(t.height * c)), g = document.createElement("canvas");
  g.width = w, g.height = y;
  const h = g.getContext("2d", { willReadFrequently: !0 });
  h.drawImage(t, 0, 0, w, y);
  const m = h.getImageData(0, 0, w, y).data, f = new Uint8Array(w * y), l = new Float32Array(w * y);
  for (let u = 0; u < f.length; u++)
    f[u] = m[4 * u + 3], l[u] = (0.2126 * m[4 * u] + 0.7152 * m[4 * u + 1] + 0.0722 * m[4 * u + 2]) / 255;
  const p = { key: a, data: Xn(f, w, y, e, n, s, s ? l : void 0), width: w, height: y };
  return Zt.set(t, p), { ...p, computed: !0, ms: performance.now() - i };
}
const Je = Object.freeze({
  enabled: !1,
  x: 0.2,
  y: 0.2,
  z: 0.45,
  color: 16777215,
  strength: 0.8,
  intensity: 0.8,
  ambient: 0.4,
  mode: "soft",
  shadow: !1,
  reach: 1.2,
  ambientColor: 15659256,
  softness: 0.45,
  specular: 0.12,
  rim: 0.3,
  detail: 0.4
}), Wt = {
  x: [0, 1],
  y: [0, 1],
  z: [0.1, 2],
  color: [0, 16777215],
  strength: [0, 1],
  intensity: [0, 2],
  ambient: [0, 1],
  reach: [0.2, 3],
  ambientColor: [0, 16777215],
  softness: [0, 1],
  specular: [0, 1],
  rim: [0, 1],
  detail: [0, 1]
}, Pn = /* @__PURE__ */ new Set(["color", "ambientColor"]);
function Cn(t) {
  if (!t || typeof t != "object" || Array.isArray(t)) return null;
  const e = t;
  if (Object.keys(e).length !== Object.keys(Je).length || Object.keys(e).some((s) => !(s in Je)) || ![!0, !1].includes(e.enabled) || ![!0, !1].includes(e.shadow) || !["soft", "cel"].includes(e.mode)) return null;
  const n = { ...Je, enabled: e.enabled, shadow: e.shadow, mode: e.mode };
  for (const s of Object.keys(Wt)) {
    const a = e[s], [o, i] = Wt[s];
    if (typeof a != "number" || !Number.isFinite(a) || Pn.has(s) && !Number.isInteger(a)) return null;
    n[s] = Math.max(o, Math.min(i, a));
  }
  return n;
}
const pt = -0.1, In = 0.9, Nn = 1, Dn = 1.06;
function Zn(t, e) {
  return [(0.5 - t) * 0.12, (0.5 - e) * 0.12];
}
function Wn(t, e, n, s) {
  const a = t * Math.PI / 180, o = e * Math.PI / 180, i = -n / 30 * s, c = Math.cos(a), w = Math.sin(a), y = Math.cos(o), g = Math.sin(o), h = Math.cos(i), m = Math.sin(i);
  return [
    h * c,
    m * c,
    -w,
    h * w * g - m * y,
    m * w * g + h * y,
    c * g,
    h * w * y + m * g,
    m * w * y - h * g,
    c * y
  ];
}
class Gn {
  constructor(e, n) {
    this.gl = e, this.program = n(e, `#version 300 es
      out vec2 vUv;
      void main() { vec2 p = vec2(float((gl_VertexID << 1) & 2), float(gl_VertexID & 2)); vUv = p; gl_Position = vec4(p * 2.0 - 1.0, 0, 1); }`, `#version 300 es
      precision highp float; in vec2 vUv; out vec4 o;
      uniform sampler2D uTex; uniform vec2 uStep; uniform vec2 uShift; uniform int uPass;
      float alphaAt(vec2 p) { if (any(lessThan(p, vec2(0))) || any(greaterThan(p, vec2(1)))) return 0.0; return texture(uTex, p).a; }
      void main() {
        if (uPass == 2) { o = texture(uTex, vUv); return; }
        vec2 p = vUv - uShift;
        float a = alphaAt(p) * 0.227027;
        a += (alphaAt(p + uStep * 1.384615) + alphaAt(p - uStep * 1.384615)) * 0.316216;
        a += (alphaAt(p + uStep * 3.230769) + alphaAt(p - uStep * 3.230769)) * 0.070270;
        o = uPass == 0 ? vec4(0, 0, 0, a) : vec4(vec3(0.035, 0.045, 0.065) * a * 0.28, a * 0.28);
      }`), this.vao = e.createVertexArray(), this.targets = [];
  }
  target(e, n) {
    const s = this.gl, a = s.createTexture(), o = s.createFramebuffer();
    if (s.bindTexture(s.TEXTURE_2D, a), s.texImage2D(s.TEXTURE_2D, 0, s.RGBA, e, n, 0, s.RGBA, s.UNSIGNED_BYTE, null), s.texParameteri(s.TEXTURE_2D, s.TEXTURE_MIN_FILTER, s.LINEAR), s.texParameteri(s.TEXTURE_2D, s.TEXTURE_MAG_FILTER, s.LINEAR), s.texParameteri(s.TEXTURE_2D, s.TEXTURE_WRAP_S, s.CLAMP_TO_EDGE), s.texParameteri(s.TEXTURE_2D, s.TEXTURE_WRAP_T, s.CLAMP_TO_EDGE), s.bindFramebuffer(s.FRAMEBUFFER, o), s.framebufferTexture2D(s.FRAMEBUFFER, s.COLOR_ATTACHMENT0, s.TEXTURE_2D, a, 0), s.checkFramebufferStatus(s.FRAMEBUFFER) !== s.FRAMEBUFFER_COMPLETE) throw new Error("Shadow framebuffer unavailable");
    return { texture: a, framebuffer: o };
  }
  begin(e, n) {
    const s = this.gl;
    (this.width !== e || this.height !== n) && (this.clearTargets(), this.width = e, this.height = n, this.targets = [this.target(e, n), this.target(Math.ceil(e / 2), Math.ceil(n / 2))]), s.bindFramebuffer(s.FRAMEBUFFER, this.targets[0].framebuffer), s.viewport(0, 0, e, n), s.clearColor(0, 0, 0, 0), s.clear(s.COLOR_BUFFER_BIT);
  }
  composite(e) {
    const n = this.gl, { prog: s, u: a } = this.program, o = this.width, i = this.height;
    n.useProgram(s), n.bindVertexArray(this.vao), n.activeTexture(n.TEXTURE0), n.uniform1i(a.uTex, 0), n.disable(n.BLEND), n.bindFramebuffer(n.FRAMEBUFFER, this.targets[1].framebuffer), n.viewport(0, 0, Math.ceil(o / 2), Math.ceil(i / 2)), n.bindTexture(n.TEXTURE_2D, this.targets[0].texture), n.uniform1i(a.uPass, 0), n.uniform2f(a.uShift, 0, 0), n.uniform2f(a.uStep, 3 / o, 0), n.drawArrays(n.TRIANGLES, 0, 3), n.bindFramebuffer(n.FRAMEBUFFER, null), n.viewport(0, 0, o, i), n.clearColor(0, 0, 0, 0), n.clear(n.COLOR_BUFFER_BIT), n.enable(n.BLEND), n.bindTexture(n.TEXTURE_2D, this.targets[1].texture);
    const c = Zn(e.x, e.y);
    n.uniform1i(a.uPass, 1), n.uniform2f(a.uShift, c[0], -c[1]), n.uniform2f(a.uStep, 0, 3 / i), n.drawArrays(n.TRIANGLES, 0, 3), n.bindTexture(n.TEXTURE_2D, this.targets[0].texture), n.uniform1i(a.uPass, 2), n.drawArrays(n.TRIANGLES, 0, 3), n.bindVertexArray(null);
  }
  clearTargets() {
    for (const e of this.targets)
      this.gl.deleteTexture(e.texture), this.gl.deleteFramebuffer(e.framebuffer);
    this.targets = [];
  }
  destroy() {
    this.clearTargets(), this.gl.deleteProgram(this.program.prog), this.gl.deleteVertexArray(this.vao);
  }
}
function Vn(t, e) {
  const { IMG: n, EYES: s, MOUTH: a, CHEEKS: o } = t, i = `#version 300 es
  in vec2 aPos; in vec2 aUv;
  uniform vec2 uScale; uniform vec2 uOffset;
  out vec2 vUv;
  void main() { vUv = aUv; gl_Position = vec4(aPos * uScale + uOffset, 0.0, 1.0); }`, c = `#version 300 es
  precision highp float;
  in vec2 vUv; out vec4 outColor;
  uniform sampler2D uTex;
  uniform vec4 uRect;        // layer rect in source px
  uniform int uFace;
  uniform float uAlpha;
  uniform vec4 uEyeBox[2];   // x0, x1, -, -
  uniform float uEyeTop[48]; // 2 eyes x EYE_N samples
  uniform float uEyeBot[48];
  uniform vec4 uEyeState[2]; // open, smile, ballX(px), ballY(px)
  uniform vec4 uMouth;       // cx, cy, angle, halfLen
  uniform vec4 uMouthState;  // open, form, bow, -
  uniform vec4 uCheeks;      // x0, y0, x1, y1
  uniform float uCheek;

  const int EYE_N = 24;
  float crv(int e, bool top, float u) {
    float f = clamp(u, 0.0, 1.0) * float(EYE_N - 1);
    int i = min(int(floor(f)), EYE_N - 2);
    float t = f - float(i);
    int k = e * EYE_N + i;
    return top ? mix(uEyeTop[k], uEyeTop[k + 1], t) : mix(uEyeBot[k], uEyeBot[k + 1], t);
  }

  // Upper lid line and lower lid line of eye e at column u, for the current open/smile state.
  // Must match eyeLids() in rig.js, which moves the lash meshes to the same lines.
  // Must match eyeLidsRaw() / eyeLids() in rig.js.
  vec2 eyeLidsRaw(int e, float u) {
    u = clamp(u, 0.0, 1.0);
    vec4 st = uEyeState[e];
    float top = crv(e, true, u), bot = crv(e, false, u);
    float b = 1.0 - st.x, smile = st.y, hump = 4.0 * u * (1.0 - u);
    float H = crv(e, false, 0.5) - crv(e, true, 0.5);
    float arc = mix(uEyeTop[e * EYE_N], uEyeTop[e * EYE_N + EYE_N - 1], u) - 0.3 * H * hump;
    float closed = max(top, bot + 1.0 + (arc - bot - 1.0) * smile);
    return vec2((closed - top) * max(b, -0.07), b > 0.0 ? (closed - bot) * b * smile : 0.0);
  }

  vec2 eyeLids(int e, float u, float top, float bot) {
    vec4 box = uEyeBox[e];
    float du = 5.0 / (box.y - box.x);
    vec2 raw = eyeLidsRaw(e, u);
    vec2 d = (eyeLidsRaw(e, u - 2.0 * du) + 2.0 * eyeLidsRaw(e, u - du) + 3.0 * raw
            + 2.0 * eyeLidsRaw(e, u + du) + eyeLidsRaw(e, u + 2.0 * du)) / 9.0;
    // for hiding the ball take whichever closes more: the smoothed lash can sit a little
    // above the raw lid near the corners, and the gap must show lid skin, not eye white
    return vec2(top + max(d.x, raw.x), bot + min(d.y, raw.y));
  }

  vec4 texAt(vec2 p) { return texture(uTex, (p - uRect.xy) / uRect.zw); }

  // Half-eye sprites share the open eye's rig curves. Use the middle of that
  // opening for gaze, tapering travel near the painted lids and corners.
  vec2 halfEyeUv(int e, vec2 p) {
    vec2 gaze = uEyeState[e].zw;
    vec2 box = uEyeBox[e].xy;
    float span = box.y - box.x;
    float u = (p.x - box.x) / span;
    if (all(equal(gaze, vec2(0.0))) || u <= 0.0 || u >= 1.0) return vUv;
    float top = crv(e, true, u), bottom = crv(e, false, u);
    float height = bottom - top;
    if (height < 2.0) return vUv;
    float v = (p.y - top) / height;
    float w = smoothstep(0.18, 0.34, v) * (1.0 - smoothstep(0.70, 0.85, v))
            * smoothstep(0.0, 0.23, min(u, 1.0 - u));
    if (w == 0.0) return vUv;
    float x = p.x - clamp(gaze.x * 0.8, -0.08 * span, 0.08 * span) * w;
    float sourceU = (x - box.x) / span;
    float dy = clamp(gaze.y / height, -0.05, 0.05) * w;
    float y = mix(crv(e, true, sourceU), crv(e, false, sourceU), v - dy);
    return (vec2(x, y) - uRect.xy) / uRect.zw;
  }

  // Eye white + iris layer: shown only between the lids (the lids cover it, it never squashes);
  // the iris slides inside the opening for the gaze.
  vec4 eyeBall(int e, vec2 p) {
    vec4 box = uEyeBox[e]; vec4 st = uEyeState[e];
    float u = clamp((p.x - box.x) / (box.y - box.x), 0.0, 1.0);
    float top = crv(e, true, u), bot = crv(e, false, u);
    vec2 lids = eyeLids(e, u, top, bot);
    float v = clamp((p.y - top) / max(bot - top, 1.0), 0.0, 1.0);
    float w = sqrt(4.0 * u * (1.0 - u)) * sqrt(4.0 * v * (1.0 - v));
    vec4 c = texAt(p - vec2(st.z, st.w) * w);
      // the lash covers ~2px of the ball's upper edge, so the cut can sit under it (no seam)
    return c * smoothstep(lids.x - 1.0, lids.x + 0.5, p.y) * (1.0 - smoothstep(lids.y - 0.9, lids.y + 0.6, p.y));
  }

  vec4 mouth(vec2 p, vec4 base) {
    float open = uMouthState.x;
    if (open < 0.01) return base;
    vec2 d = vec2(cos(uMouth.z), sin(uMouth.z)), n = vec2(-d.y, d.x);
    vec2 r = p - uMouth.xy;
    float s = dot(r, d) / uMouth.w, t = dot(r, n);
    float form = uMouthState.y;                       // -1 wide "i" .. +1 round "o"
    float wf = mix(0.78, 0.46, clamp(form * 0.5 + 0.5, 0.0, 1.0));
    float k = 1.0 - (s / wf) * (s / wf);
    if (k <= 0.0) return base;
    float line = uMouthState.z * (1.0 - s * s);
    float hk = pow(k, mix(0.55, 0.85, clamp(form, 0.0, 1.0)));
    float H = mix(20.0, 26.0, clamp(form, 0.0, 1.0));
    float up = line - 0.6 - open * 2.5 * hk;
    float lo = line + open * H * hk;
    float cov = smoothstep(-0.7, 0.7, t - up) * smoothstep(-0.7, 0.7, lo - t);
    if (cov <= 0.0) return base;
    float tv = clamp((t - up) / max(lo - up, 1.0), 0.0, 1.0);
    vec3 col = mix(vec3(0.24, 0.05, 0.08), vec3(0.48, 0.15, 0.19), tv);
    float tongue = smoothstep(0.5, 0.78, tv) * (1.0 - smoothstep(0.45, 0.8, abs(s) / wf));
    col = mix(col, vec3(0.86, 0.44, 0.47), tongue * 0.9);
    float teeth = (1.0 - smoothstep(0.12, 0.22, tv)) * smoothstep(0.25, 0.45, open) * (1.0 - smoothstep(0.55, 0.85, abs(s) / wf));
    col = mix(col, vec3(0.99, 0.96, 0.94), teeth);
    float rim = 1.0 - smoothstep(0.6, 1.8, lo - t);
    col = mix(col, vec3(0.36, 0.09, 0.11), rim * 0.85);
    return vec4(mix(base.rgb, col, cov), 1.0);
  }

  void main() {
    vec2 p = uRect.xy + vUv * uRect.zw;
    vec2 materialUv = vUv;
    vec4 c;
    if (uFace == 1) {
      c = mouth(p, texAt(p));
      float blush = exp(-dot((p - uCheeks.xy) / vec2(48.0, 22.0), (p - uCheeks.xy) / vec2(48.0, 22.0)))
                  + exp(-dot((p - uCheeks.zw) / vec2(40.0, 20.0), (p - uCheeks.zw) / vec2(40.0, 20.0)));
      c.rgb = mix(c.rgb, c.rgb * vec3(1.0, 0.62, 0.64) , clamp(blush * uCheek * 0.55, 0.0, 1.0) * c.a);
    } else if (uFace >= 4) {
      materialUv = halfEyeUv(uFace - 4, p);
      c = texture(uTex, materialUv);
    } else if (uFace >= 2) {
      c = eyeBall(uFace - 2, p);
    } else {
      c = texAt(p);
    }
    outColor = c * uAlpha;
  }`, w = i.replace("out vec2 vUv;", "in float aHeadWeight; out float vHeadWeight; out vec2 vScreen; out vec2 vUv;").replace("vUv = aUv;", "vHeadWeight = aHeadWeight; vScreen = vec2((aPos.x * uScale.x + uOffset.x + 1.0) * 0.5, (1.0 - aPos.y * uScale.y - uOffset.y) * 0.5); vUv = aUv;"), y = c.replace("uniform sampler2D uTex;", `uniform sampler2D uTex;
    uniform sampler2D uNormal; in float vHeadWeight; in vec2 vScreen;
    uniform mat3 uHeadRotation; uniform vec3 uLight; uniform vec3 uLightColor; uniform vec3 uAmbientColor;
    uniform vec4 uLighting; uniform vec4 uSurface; uniform float uAspect; uniform int uCel;`).replace("outColor = c * uAlpha;", `
      // RG hold the smooth surface normal, BA the painting's relief (see lighting/normals.ts).
      vec4 encoded = texture(uNormal, materialUv);
      vec2 base = encoded.rg * 2.0 - 1.0;
      vec3 n = vec3(base, sqrt(max(0.0, 1.0 - dot(base, base))));
      n = normalize(n + vec3((encoded.ba * 2.0 - 1.0) * uSurface.w * ${In.toFixed(3)}, 0.0));
      n = normalize(mix(n, uHeadRotation * n, vHeadWeight));
      vec2 toLight = (uLight.xy - vScreen) * vec2(uAspect, 1.0);
      vec3 light = normalize(vec3(toLight, uLight.z));
      float ndl = dot(n, light);
      float diffuse;
      if (uCel == 1) {
        float w = 0.01 + uSurface.x * 0.08;
        diffuse = 0.2 + 0.45 * smoothstep(${pt.toFixed(3)} - w, ${pt.toFixed(3)} + w, ndl) + 0.35 * smoothstep(0.55 - w, 0.55 + w, ndl);
      } else {
        float s = 0.05 + uSurface.x * 0.5;
        diffuse = smoothstep(${pt.toFixed(3)} - s, ${pt.toFixed(3)} + s, ndl) * (0.35 + 0.65 * max(0.0, ndl));
      }
      float reach = dot(toLight, toLight) / (uLighting.w * uLighting.w);
      float attenuation = 1.0 / (1.0 + reach);
      vec3 radiance = uLightColor * uLighting.y * attenuation;
      // A light close to the surface may brighten a little, but must not bleach painted colours.
      vec3 irradiance = min(uAmbientColor * uLighting.z + radiance * diffuse, vec3(${Dn.toFixed(3)}));
      // Painted shadows are deeper versions of the base colour, not grey: multiply by the colour
      // itself as the surface turns away from the light.
      vec3 albedo = c.rgb / max(c.a, 1e-4);
      float dark = 1.0 - clamp(dot(irradiance, vec3(0.3333)), 0.0, 1.0);
      vec3 shaded = c.rgb * mix(vec3(1.0), albedo, dark * ${Nn.toFixed(3)}) * irradiance;
      float specular = pow(max(dot(n, normalize(light + vec3(0.0, 0.0, 1.0))), 0.0), 60.0) * uSurface.y;
      if (uCel == 1) specular = smoothstep(0.3, 0.35, specular) * uSurface.y;
      vec2 side = length(n.xy) > 0.001 ? normalize(n.xy) : vec2(0.0);
      float rim = pow(1.0 - max(n.z, 0.0), 4.0) * smoothstep(-0.2, 0.7, dot(side, normalize(toLight + vec2(1e-4)))) * uSurface.z;
      shaded += radiance * (specular * max(0.0, ndl) + rim) * c.a;
      // Strength blends between the original painting and the relit result; alpha is unchanged.
      c.rgb = clamp(mix(c.rgb, shaded, uLighting.x), vec3(0.0), vec3(c.a));
      outColor = c * uAlpha;`), g = `#version 300 es
  in vec2 aPos; uniform vec2 uScale; uniform vec2 uOffset;
  void main() { gl_Position = vec4(aPos * uScale + uOffset, 0.0, 1.0); gl_PointSize = 7.0; }`, h = `#version 300 es
  precision mediump float; uniform vec4 uColor; out vec4 o; void main() { o = uColor; }`;
  function m(u, v, r) {
    const d = u.createProgram();
    for (const [A, F] of [[u.VERTEX_SHADER, v], [u.FRAGMENT_SHADER, r]]) {
      const U = u.createShader(A);
      if (u.shaderSource(U, F), u.compileShader(U), !u.getShaderParameter(U, u.COMPILE_STATUS)) throw new Error(u.getShaderInfoLog(U));
      u.attachShader(d, U), u.deleteShader(U);
    }
    if (u.bindAttribLocation(d, 0, "aPos"), u.bindAttribLocation(d, 1, "aUv"), u.bindAttribLocation(d, 2, "aHeadWeight"), u.linkProgram(d), !u.getProgramParameter(d, u.LINK_STATUS)) throw new Error(u.getProgramInfoLog(d));
    const x = {}, b = u.getProgramParameter(d, u.ACTIVE_UNIFORMS);
    for (let A = 0; A < b; A++) {
      const F = u.getActiveUniform(d, A).name.replace("[0]", "");
      x[F] = u.getUniformLocation(d, F);
    }
    return { prog: d, u: x };
  }
  function f(u, v, r, d) {
    const x = [u];
    let b = u;
    for (; b < u + v - 0.5; ) {
      const A = d && b >= d.from && b < d.to ? d.cell : r;
      b = Math.min(u + v, b + A), x.push(b);
    }
    return x;
  }
  function l(u, v, r, d, x = null) {
    const [b, A, F, U] = u, ne = f(b, F, v, x && { from: x.x0, to: x.x1, cell: x.cell }), X = f(A, U, v, x && { from: x.y0, to: x.y1, cell: x.cell }), G = ne.length - 1, R = X.length - 1, I = (G + 1) * (R + 1), B = new Float32Array(I * 2), j = new Float32Array(I * 2);
    for (let ae = 0; ae <= R; ae++) for (let J = 0; J <= G; J++) {
      const $ = ae * (G + 1) + J;
      B[$ * 2] = ne[J], B[$ * 2 + 1] = X[ae], j[$ * 2] = (ne[J] - b) / F, j[$ * 2 + 1] = (X[ae] - A) / U;
    }
    const Y = [], P = [], N = r.length / d, q = d === 1 ? 0 : 1;
    for (let ae = 0; ae < R; ae++) for (let J = 0; J < G; J++) {
      const $ = Math.floor(ne[J] - b) * q - 2, ee = Math.ceil(ne[J + 1] - b) * q + 2, Z = Math.floor(X[ae] - A) * q - 2, se = Math.ceil(X[ae + 1] - A) * q + 2;
      let re = !1;
      for (let T = Math.max(0, Z); T < Math.min(N, se) && !re; T += 1)
        for (let S = Math.max(0, $); S < Math.min(d, ee); S += 1)
          if (r[T * d + S] > 3) {
            re = !0;
            break;
          }
      if (!re) continue;
      const te = ae * (G + 1) + J, oe = te + 1, z = te + G + 1, M = z + 1;
      Y.push(te, oe, z, oe, M, z), P.push(te, oe, te, z, oe, z), J === G - 1 && P.push(oe, M), ae === R - 1 && P.push(z, M);
    }
    return { rect: u, cols: G, rows: R, rest: B, uv: j, pos: new Float32Array(B), tris: new Uint32Array(Y), lines: new Uint32Array(P) };
  }
  class p {
    // padTop / padSide: margin around the image, as a share of its height / width. A negative
    // padTop pushes the top of the image above the canvas (hides a cut-off top edge).
    constructor(v, { padTop: r = 0, padSide: d = 0, fit: x = "contain" } = {}) {
      this.pad = { top: r, side: d }, this.fit = x;
      const b = v.getContext("webgl2", { premultipliedAlpha: !0, antialias: !0, alpha: !0, preserveDrawingBuffer: !0 });
      if (!b) throw new Error("WebGL2 is not available");
      this.gl = b, this.canvas = v, this.main = m(b, i, c), this.line = m(b, g, h), this.layers = [], this.lighting = Je, this.lightingStats = { normalMs: 0, computedLayers: 0, cachedLayers: 0 }, b.enable(b.BLEND), b.blendFunc(b.ONE, b.ONE_MINUS_SRC_ALPHA);
    }
    texture(v) {
      const r = this.gl, d = r.createTexture();
      return r.bindTexture(r.TEXTURE_2D, d), r.pixelStorei(r.UNPACK_PREMULTIPLY_ALPHA_WEBGL, !0), r.texImage2D(r.TEXTURE_2D, 0, r.RGBA, r.RGBA, r.UNSIGNED_BYTE, v), r.generateMipmap(r.TEXTURE_2D), r.texParameteri(r.TEXTURE_2D, r.TEXTURE_MIN_FILTER, r.LINEAR_MIPMAP_LINEAR), r.texParameteri(r.TEXTURE_2D, r.TEXTURE_MAG_FILTER, r.LINEAR), r.texParameteri(r.TEXTURE_2D, r.TEXTURE_WRAP_S, r.CLAMP_TO_EDGE), r.texParameteri(r.TEXTURE_2D, r.TEXTURE_WRAP_T, r.CLAMP_TO_EDGE), d;
    }
    addLayer(v, r, d, x = {}) {
      const b = this.gl, A = b.createVertexArray();
      b.bindVertexArray(A);
      const F = b.createBuffer();
      b.bindBuffer(b.ARRAY_BUFFER, F), b.bufferData(b.ARRAY_BUFFER, d.pos, b.DYNAMIC_DRAW);
      for (const B of [this.main, this.line]) {
        const j = b.getAttribLocation(B.prog, "aPos");
        b.enableVertexAttribArray(j), b.vertexAttribPointer(j, 2, b.FLOAT, !1, 0, 0);
      }
      const U = b.createBuffer();
      b.bindBuffer(b.ARRAY_BUFFER, U), b.bufferData(b.ARRAY_BUFFER, d.uv, b.STATIC_DRAW);
      const ne = b.getAttribLocation(this.main.prog, "aUv");
      b.enableVertexAttribArray(ne), b.vertexAttribPointer(ne, 2, b.FLOAT, !1, 0, 0);
      const X = b.createBuffer();
      b.bindBuffer(b.ELEMENT_ARRAY_BUFFER, X), b.bufferData(b.ELEMENT_ARRAY_BUFFER, d.tris, b.STATIC_DRAW), b.bindVertexArray(null);
      const G = b.createBuffer();
      b.bindBuffer(b.ELEMENT_ARRAY_BUFFER, G), b.bufferData(b.ELEMENT_ARRAY_BUFFER, d.lines, b.STATIC_DRAW);
      let R = x.face ? 1 : 0;
      x.eyeBall !== void 0 && (R = 2 + x.eyeBall), x.halfEye !== void 0 && (R = 4 + x.halfEye);
      const I = { name: v, image: r, mesh: d, tex: this.texture(r), vao: A, posBuf: F, uvBuf: U, triBuf: X, lineBuf: G, visible: !0, faceMode: R, color: x.color || [1, 1, 1, 1] };
      return this.layers.push(I), I;
    }
    destroy() {
      const v = this.gl;
      for (const r of this.layers) {
        v.deleteTexture(r.tex), r.normal && v.deleteTexture(r.normal), r.headBuf && v.deleteBuffer(r.headBuf), v.deleteVertexArray(r.vao);
        for (const d of [r.posBuf, r.uvBuf, r.triBuf, r.lineBuf]) v.deleteBuffer(d);
      }
      v.deleteProgram(this.main.prog), v.deleteProgram(this.line.prog), this.lit && v.deleteProgram(this.lit.prog), this.shadow?.destroy(), this.layers.length = 0;
    }
    setLighting(v) {
      if (this.lighting = Cn({ ...Je, ...v }) ?? Je, !this.lighting.enabled) return;
      const r = this.gl;
      this.lit || (this.lit = m(r, w, y));
      for (const d of this.layers) {
        if (d.normal || d.overlay) continue;
        const x = zn(d.image, d.mesh.rect, e, !/^(eye|mouth)/.test(d.name));
        this.lightingStats.normalMs += x.ms, this.lightingStats[x.computed ? "computedLayers" : "cachedLayers"]++, d.normal = r.createTexture(), r.activeTexture(r.TEXTURE0), r.bindTexture(r.TEXTURE_2D, d.normal), r.pixelStorei(r.UNPACK_PREMULTIPLY_ALPHA_WEBGL, !1), r.texImage2D(r.TEXTURE_2D, 0, r.RGBA, x.width, x.height, 0, r.RGBA, r.UNSIGNED_BYTE, x.data), r.generateMipmap(r.TEXTURE_2D), r.texParameteri(r.TEXTURE_2D, r.TEXTURE_MIN_FILTER, r.LINEAR_MIPMAP_LINEAR), r.texParameteri(r.TEXTURE_2D, r.TEXTURE_MAG_FILTER, r.LINEAR), r.texParameteri(r.TEXTURE_2D, r.TEXTURE_WRAP_S, r.CLAMP_TO_EDGE), r.texParameteri(r.TEXTURE_2D, r.TEXTURE_WRAP_T, r.CLAMP_TO_EDGE);
        const b = new Float32Array(d.mesh.rest.length / 2);
        for (let A = 0; A < b.length; A++) b[A] = t.headWeight(d.mesh.rest[A * 2], d.mesh.rest[A * 2 + 1]);
        d.headBuf = r.createBuffer(), r.bindVertexArray(d.vao), r.bindBuffer(r.ARRAY_BUFFER, d.headBuf), r.bufferData(r.ARRAY_BUFFER, b, r.STATIC_DRAW), r.enableVertexAttribArray(2), r.vertexAttribPointer(2, 1, r.FLOAT, !1, 0, 0);
      }
      r.bindVertexArray(null), this.lighting.shadow && !this.shadow && (this.shadow = new Gn(r, m));
    }
    resize() {
      const v = this.canvas, r = Math.min(window.devicePixelRatio || 1, 2), d = Math.round(v.clientWidth * r), x = Math.round(v.clientHeight * r);
      (v.width !== d || v.height !== x) && (v.width = d, v.height = x);
      const b = (this.fit === "cover" ? Math.max : Math.min)(d / (n.w * (1 + 2 * this.pad.side)), x / (n.h * (1 + this.pad.top))), A = (d - n.w * b) / 2, F = (x - n.h * b) / (this.fit === "cover" ? 2 : 1);
      this.scale = [2 * b / d, -2 * b / x], this.offset = [-1 + 2 * A / d, 1 - 2 * F / x], this.pxScale = b, this.pxOff = [A, F];
    }
    draw(v) {
      const r = this.gl;
      this.resize(), r.viewport(0, 0, this.canvas.width, this.canvas.height), r.clearColor(0, 0, 0, 0), r.clear(r.COLOR_BUFFER_BIT);
      const d = this.lighting.enabled, x = d && this.lighting.shadow;
      x && this.shadow.begin(this.canvas.width, this.canvas.height);
      const b = d ? this.lit : this.main;
      if (this.current = b, r.useProgram(b.prog), d) {
        const A = this.lighting;
        r.uniform1i(b.u.uNormal, 1), r.uniform3f(b.u.uLight, A.x, A.y, A.z), r.uniform3f(b.u.uLightColor, (A.color >> 16 & 255) / 255, (A.color >> 8 & 255) / 255, (A.color & 255) / 255), r.uniform3f(b.u.uAmbientColor, (A.ambientColor >> 16 & 255) / 255, (A.ambientColor >> 8 & 255) / 255, (A.ambientColor & 255) / 255), r.uniform4f(b.u.uLighting, A.strength, A.intensity, A.ambient, A.reach), r.uniform4f(b.u.uSurface, A.softness, A.specular, A.rim, A.detail), r.uniform1f(b.u.uAspect, this.canvas.width / this.canvas.height), r.uniform1i(b.u.uCel, A.mode === "cel" ? 1 : 0), r.uniformMatrix3fv(b.u.uHeadRotation, !1, Wn(v.angleX ?? 0, v.angleY ?? 0, v.angleZ ?? 0, e.head.maxRoll));
      }
      r.uniform2fv(b.u.uScale, this.scale), r.uniform2fv(b.u.uOffset, this.offset), r.uniform1i(b.u.uTex, 0), r.uniform4fv(b.u.uEyeBox, s.flatMap((A) => [A.x0, A.x1, 0, 0])), r.uniform1fv(b.u.uEyeTop, s.flatMap((A) => A.top)), r.uniform1fv(b.u.uEyeBot, s.flatMap((A) => A.bot)), r.uniform4fv(b.u.uEyeState, v.eyes), r.uniform4f(b.u.uMouth, a.cx, a.cy, a.angle, a.halfLen), r.uniform4f(b.u.uMouthState, v.mouthOpen, v.mouthForm, a.bow, 0), r.uniform4f(b.u.uCheeks, o[0][0], o[0][1], o[1][0], o[1][1]), r.uniform1f(b.u.uCheek, v.cheek), r.activeTexture(r.TEXTURE0);
      for (const A of this.layers)
        !A.visible || A.overlay || this.drawLayer(A, A.alpha ?? 1);
      if (this.original && v.originalAlpha > 0 && this.drawLayer(this.original, v.originalAlpha), x && this.shadow.composite(this.lighting), v.showMesh) {
        const A = this.line;
        r.useProgram(A.prog), r.uniform2fv(A.u.uScale, this.scale), r.uniform2fv(A.u.uOffset, this.offset);
        for (const F of this.layers)
          !F.visible || F.overlay || (r.bindVertexArray(F.vao), r.bindBuffer(r.ELEMENT_ARRAY_BUFFER, F.lineBuf), r.uniform4fv(A.u.uColor, F.color), r.drawElements(r.LINES, F.mesh.lines.length, r.UNSIGNED_INT, 0), r.bindBuffer(r.ELEMENT_ARRAY_BUFFER, F.triBuf));
        v.joints?.length && this.drawPoints(v.joints), r.bindVertexArray(null);
      }
    }
    drawLayer(v, r) {
      const d = this.gl, x = this.current;
      d.useProgram(x.prog), d.bindVertexArray(v.vao), d.bindBuffer(d.ARRAY_BUFFER, v.posBuf), d.bufferSubData(d.ARRAY_BUFFER, 0, v.mesh.pos), this.lighting.enabled && (d.activeTexture(d.TEXTURE1), d.bindTexture(d.TEXTURE_2D, v.normal), d.activeTexture(d.TEXTURE0)), d.bindTexture(d.TEXTURE_2D, v.tex), d.uniform4fv(x.u.uRect, v.mesh.rect), d.uniform1i(x.u.uFace, v.faceMode), d.uniform1f(x.u.uAlpha, r), d.drawElements(d.TRIANGLES, v.mesh.tris.length, d.UNSIGNED_INT, 0);
    }
    drawPoints(v) {
      const r = this.gl, d = this.line;
      if (!this.pointBuf) {
        this.pointBuf = r.createBuffer(), this.pointVao = r.createVertexArray(), r.bindVertexArray(this.pointVao), r.bindBuffer(r.ARRAY_BUFFER, this.pointBuf);
        const x = r.getAttribLocation(d.prog, "aPos");
        r.enableVertexAttribArray(x), r.vertexAttribPointer(x, 2, r.FLOAT, !1, 0, 0);
      }
      r.bindVertexArray(this.pointVao), r.bindBuffer(r.ARRAY_BUFFER, this.pointBuf), r.bufferData(r.ARRAY_BUFFER, new Float32Array(v.flat()), r.DYNAMIC_DRAW), r.uniform4f(d.u.uColor, 1, 0.85, 0.2, 1), r.drawArrays(r.POINTS, 0, v.length);
    }
    // canvas CSS px -> source image px
    toImage(v, r) {
      if (!this.pxOff) return null;
      const d = this.canvas.width / this.canvas.clientWidth;
      return [(v * d - this.pxOff[0]) / this.pxScale, (r * d - this.pxOff[1]) / this.pxScale];
    }
  }
  return { Renderer: p, buildGrid: l };
}
function Hn(t, e) {
  const { applyHead: n, applyBody: s, TASSELS: a, tasselAnchor: o } = t, i = (e.strands ?? []).map((r) => {
    if (r.nodes.length === 4) return r;
    const d = Array.from({ length: 4 }, (x, b) => {
      const A = b / 3 * (r.nodes.length - 1), F = Math.min(r.nodes.length - 2, Math.floor(A)), U = A - F;
      return [0, 1].map((ne) => r.nodes[F][ne] + (r.nodes[F + 1][ne] - r.nodes[F][ne]) * U);
    });
    return { ...r, nodes: d };
  }), c = [0, 300, 200, 140], w = 0.9, y = 7, g = { stiff: 1.7, damp: 1.6, couple: 0.85, reach: 0.9, bind: 4 }, h = Math.min(6, i.filter((r) => r.name.startsWith("bang")).length), m = { freq: 0.7, zeta: 0.22, hang: 0.85, inertia: 0.32, wind: 0.03, max: 0.55, smooth: 6 }, f = (r, d) => [r[0] * Math.cos(d) - r[1] * Math.sin(d), r[0] * Math.sin(d) + r[1] * Math.cos(d)], l = (r, d) => {
    const x = Math.hypot(r[0], r[1]);
    if (x < 1e-6) return r;
    const b = d * Math.tanh(x / d) / x;
    return [r[0] * b, r[1] * b];
  }, p = Object.fromEntries(Object.entries(e.buns ?? {}).map(([r, d]) => [r, { at: [d.cx, d.cy], k: 260, c: 11, hang: 3, max: 4 }])), u = (r, d) => {
    const x = Math.hypot(r[0], r[1]);
    x > d && (r[0] *= d / x, r[1] *= d / x);
  };
  class v {
    constructor() {
      this.gain = 1, this.out = { gain: 1, bunL: [0, 0], bunR: [0, 0] }, this.hair = {};
      for (const d of Object.keys(p))
        this.hair[d] = { p: null, v: [0, 0] }, this.out[d] = [0, 0];
      this.strands = i.map(() => ({ p: null, v: [[0, 0], [0, 0], [0, 0], [0, 0]] })), this.out.strands = i.map(() => [[0, 0], [0, 0], [0, 0], [0, 0]]), this.chains = a.map((d) => {
        const x = d.tip[0] - d.pivot[0], b = d.tip[1] - d.pivot[1], A = Math.hypot(x, b), F = [x / A, b / A];
        return { t: d, dir: F, L1: A * d.split, L2: A * (1 - d.split), pts: null, prev: null, phi: [0, 0], anchor: [0, 0] };
      }), this.time = 0;
    }
    hairAnchor(d, x) {
      const b = [d[0], d[1]];
      return n(b, 1, x), s(b, d[1], x), b;
    }
    step(d, x) {
      t.stepBody?.(d, x);
      const b = Math.max(1, Math.ceil(x / (1 / 240))), A = Math.min(x, 0.05) / b, F = -d.angleZ / 30 * e.head.maxRoll - d.bodyAngleZ / 10 * e.body.maxRoll, U = this.gain;
      i.forEach((X, G) => {
        const R = this.strands[G], I = this.out.strands[G], B = X.nodes.map((Y) => this.hairAnchor(Y, d));
        R.p || (R.p = B.map((Y) => [...Y]));
        const j = G * 1.7;
        for (let Y = 0; Y < b; Y++) {
          const P = this.time + Y * A;
          for (let N = 1; N < 4; N++) {
            const q = Math.hypot(X.nodes[N][0] - X.nodes[0][0], X.nodes[N][1] - X.nodes[0][1]), ae = (Math.sin(P * 1.3) * 0.5 + Math.sin(P * 3.1) * 0.3 + Math.sin(P * 4.7 + j) * 0.2) * X.max * 0.1 * N / 3, J = [R.p[N - 1][0] - B[N - 1][0], R.p[N - 1][1] - B[N - 1][1]], $ = B[N][0] + J[0] * w * g.couple - Math.sin(F) * q * 0.12 + ae, ee = B[N][1] + J[1] * w * g.couple, Z = c[N] * X.k * g.stiff / Math.max(0.35, U), se = y * g.damp * Math.sqrt(g.stiff) / Math.max(0.5, Math.sqrt(U)), re = R.v[N], te = R.p[N];
            re[0] += (Z * ($ - te[0]) - se * re[0]) * A, re[1] += (Z * (ee - te[1]) - se * re[1]) * A, te[0] += re[0] * A, te[1] += re[1] * A;
          }
          R.p[0] = [...B[0]];
        }
        for (let Y = 0; Y < 4; Y++) {
          const P = [R.p[Y][0] - B[Y][0], R.p[Y][1] - B[Y][1]];
          I[Y] = l(P, Math.max(0.5, X.max * g.reach * Math.max(1, U) * Y / 3));
        }
      });
      for (const [X, G] of Object.entries(p)) {
        const R = this.hair[X], I = this.hairAnchor(G.at, d), B = Math.sin(this.time * 1.3 + G.at[0] * 0.01) * 0.6 + Math.sin(this.time * 2.9 + G.at[1] * 0.02) * 0.4, j = I[0] - Math.sin(F) * G.hang + B * G.max * 0.12, Y = I[1];
        R.p || (R.p = [j, Y]);
        const P = G.k / Math.max(0.35, U), N = G.c / Math.max(0.5, Math.sqrt(U));
        for (let ae = 0; ae < b; ae++)
          R.v[0] += (P * (j - R.p[0]) - N * R.v[0]) * A, R.v[1] += (P * (Y - R.p[1]) - N * R.v[1]) * A, R.p[0] += R.v[0] * A, R.p[1] += R.v[1] * A;
        const q = [R.p[0] - I[0], R.p[1] - I[1]];
        u(q, G.max * Math.max(1, U)), this.out[X] = q;
      }
      this.out.gain = 1;
      const ne = this.out.strands;
      for (let X = 0; X < g.bind; X++) for (let G = 1; G < 4; G++) {
        const R = ne.slice(0, h).map((I) => [...I[G]]);
        for (let I = 0; I < h; I++) {
          const B = R[Math.max(0, I - 1)], j = R[Math.min(h - 1, I + 1)];
          for (const Y of [0, 1]) ne[I][G][Y] = R[I][Y] * 0.5 + (B[Y] + j[Y]) * 0.25;
        }
      }
      for (const X of this.chains) {
        const G = o(X.t, d, this.out, [0, 0]);
        X.st || (X.st = { th: [0, 0], w: [0, 0], pos: [...G], vel: [0, 0], acc: [0, 0] });
        const R = X.st, I = m, B = [(G[0] - R.pos[0]) / Math.max(x, 1e-3), (G[1] - R.pos[1]) / Math.max(x, 1e-3)], j = 1 - Math.exp(-x * I.smooth), Y = [(B[0] - R.vel[0]) / Math.max(x, 1e-3), (B[1] - R.vel[1]) / Math.max(x, 1e-3)];
        R.acc = [R.acc[0] + (Y[0] - R.acc[0]) * j, R.acc[1] + (Y[1] - R.acc[1]) * j], R.vel = [R.vel[0] + (B[0] - R.vel[0]) * j, R.vel[1] + (B[1] - R.vel[1]) * j], R.pos = [...G];
        const P = [-X.dir[1], X.dir[0]], N = -(R.acc[0] * P[0] + R.acc[1] * P[1]) / (X.L1 + X.L2) * I.inertia, q = (Math.sin(this.time * 0.9 + X.t.pivot[0]) * 0.6 + Math.sin(this.time * 0.37 + X.t.pivot[1]) * 0.4) * I.wind, ae = -F * I.hang + q, J = 2 * Math.PI * I.freq / Math.sqrt(Math.max(0.4, U)), $ = J * 1.35;
        for (let re = 0; re < b; re++) {
          const te = -J * J * (R.th[0] - ae) - 2 * I.zeta * J * R.w[0] + N;
          R.w[0] += te * A, R.th[0] += R.w[0] * A;
          const oe = -$ * $ * (R.th[1] - R.th[0]) - 2 * I.zeta * $ * R.w[1] + N * 0.4 + te * 0.5;
          R.w[1] += oe * A, R.th[1] += R.w[1] * A;
        }
        R.th[0] = Math.max(-0.55, Math.min(I.max, R.th[0])), R.th[1] = Math.max(-0.55 * 1.4, Math.min(I.max * 1.4, R.th[1])), X.phi = [R.th[0], R.th[1]];
        const ee = f(X.dir, R.th[0]), Z = f(X.dir, R.th[1]), se = [G[0] + ee[0] * X.L1, G[1] + ee[1] * X.L1];
        X.pts = [[...G], se, [se[0] + Z[0] * X.L2, se[1] + Z[1] * X.L2]], X.anchor = G;
      }
      return this.time += x, this.out;
    }
  }
  return { Physics: v };
}
const cn = (t, e) => t.reduce((n, s, a) => n + s * e[a], 0);
function qn(t, e) {
  const n = e.length, s = Array.from({ length: n }, () => Array(n).fill(0));
  for (let i = 0; i < n; i++) for (let c = 0; c <= i; c++) {
    let w = t[i][c];
    for (let y = 0; y < c; y++) w -= s[i][y] * s[c][y];
    s[i][c] = i === c ? Math.sqrt(Math.max(1e-18, w)) : w / s[c][c];
  }
  const a = [], o = [];
  for (let i = 0; i < n; i++) a[i] = (e[i] - cn(s[i].slice(0, i), a)) / s[i][i];
  for (let i = n - 1; i >= 0; i--) {
    let c = a[i];
    for (let w = i + 1; w < n; w++) c -= s[w][i] * o[w];
    o[i] = c / s[i][i];
  }
  return o;
}
function Jn(t) {
  const e = t.map((a) => [...a]), n = e.length, s = e.map((a, o) => e.map((i, c) => +(o === c)));
  for (let a = 0; a < 100 * n * n; a++) {
    let o = 0, i = 1, c = 0;
    for (let l = 0; l < n; l++) for (let p = l + 1; p < n; p++) Math.abs(e[l][p]) > c && (c = Math.abs(e[l][p]), o = l, i = p);
    if (c < 1e-12) break;
    const w = 0.5 * Math.atan2(2 * e[o][i], e[i][i] - e[o][o]), y = Math.cos(w), g = Math.sin(w), h = e[o][o], m = e[i][i], f = e[o][i];
    for (let l = 0; l < n; l++) if (l !== o && l !== i) {
      const p = e[l][o], u = e[l][i];
      e[l][o] = e[o][l] = y * p - g * u, e[l][i] = e[i][l] = g * p + y * u;
    }
    e[o][o] = y * y * h - 2 * g * y * f + g * g * m, e[i][i] = g * g * h + 2 * g * y * f + y * y * m, e[o][i] = e[i][o] = 0;
    for (let l = 0; l < n; l++) {
      const p = s[l][o], u = s[l][i];
      s[l][o] = y * p - g * u, s[l][i] = g * p + y * u;
    }
  }
  return { values: e.map((a, o) => a[o]), vectors: s };
}
function Kn(t, e, n, s = 1) {
  const a = t.map((h, m) => t.slice(m).reduce((f, l) => f + l, 0)), o = t.map((h, m) => t.map((f, l) => a[Math.max(m, l)] * h * f)), i = t.map((h, m) => e * a[m] * h), c = i.map(Math.sqrt), w = Jn(o.map((h, m) => h.map((f, l) => f / c[m] / c[l]))), y = w.values.indexOf(Math.max(...w.values)), g = t.map((h, m) => t.map((f, l) => c[m] * c[l] * w.values.reduce((p, u, v) => p + w.vectors[m][v] * w.vectors[l][v] * 2 * n * Math.sqrt(u) * (v === y ? 1 : s), 0)));
  return { lengths: t, mass: a, coefficient: o, stiffness: i, damping: g, frequencies: w.values.map((h) => 1 / Math.sqrt(h) / (2 * Math.PI)).sort((h, m) => h - m), angles: t.map(() => 0), velocities: t.map(() => 0) };
}
function Mt(t, e = t.angles, n = t.velocities) {
  let s = t.stiffness.reduce((a, o, i) => a + o * (1 - Math.cos(e[i])), 0);
  for (let a = 0; a < e.length; a++) for (let o = 0; o < e.length; o++) s += 0.5 * t.coefficient[a][o] * Math.cos(e[a] - e[o]) * n[a] * n[o];
  return s;
}
function Qn(t, e, n = 0, s = 1) {
  const a = t.angles, o = t.velocities, i = t.coefficient.map((g, h) => g.map((m, f) => m * Math.cos(a[h] - a[f]))), c = a.map((g, h) => cn(i[h], o) + e * (-t.stiffness[h] * s * Math.sin(g) - n * t.mass[h] * t.lengths[h] * Math.cos(g) - t.coefficient[h].reduce((m, f, l) => m + f * Math.sin(g - a[l]) * o[l] * o[l], 0)));
  let w = qn(i.map((g, h) => g.map((m, f) => m + e * t.damping[h][f])), c), y = a.map((g, h) => g + e * w[h]);
  if (n === 0 && s === 1) {
    const g = Mt(t), h = Mt(t, y, w.map(() => 0)), m = Mt(t, y, w);
    if (m > g)
      if (h > g)
        y = [...a], w = o.map((f) => f * 0.999);
      else {
        const f = Math.sqrt(Math.max(0, (g - h) / Math.max(1e-30, m - h)));
        w = w.map((l) => l * f);
      }
  }
  t.angles = y, t.velocities = w;
}
const mn = Object.freeze({
  responseGain: 1,
  swing: 1,
  stiffness: 1,
  damping: 1,
  follow: 0.85,
  cohesion: 3,
  wind: 0.05,
  max: 20
}), pn = Object.freeze({ tierGain: 1, highModeDamping: 1 });
function es(t) {
  if (!t || typeof t != "object" || Array.isArray(t)) throw new TypeError("Expected cloth tuning");
  for (const [e, n] of Object.entries(t)) {
    if (!Object.hasOwn(mn, e) && !Object.hasOwn(pn, e)) throw new RangeError(`Unknown cloth tuning: ${e}`);
    if (typeof n != "number" || !Number.isFinite(n)) throw new RangeError(`${e}: expected a finite number`);
    if (["tierGain", "highModeDamping", "responseGain", "swing", "stiffness", "damping", "max"].includes(e) && n <= 0) throw new RangeError(`${e}: must be positive`);
    if (["follow", "wind"].includes(e) && (n < 0 || e === "follow" && n > 1)) throw new RangeError(`${e}: out of range`);
    if (e === "cohesion" && (!Number.isInteger(n) || n < 0 || n > 8)) throw new RangeError("cohesion: expected an integer from 0 to 8");
  }
}
function Gt(t, e) {
  const n = [0];
  for (let a = 1; a < t.length; a++)
    n.push(n[a - 1] + Math.hypot(t[a][0] - t[a - 1][0], t[a][1] - t[a - 1][1]));
  const s = n.at(-1);
  return Array.from({ length: e }, (a, o) => {
    const i = s * o / (e - 1);
    let c = 1;
    for (; c < t.length - 1 && n[c] < i; ) c++;
    const w = (i - n[c - 1]) / Math.max(1e-9, n[c] - n[c - 1]);
    return [0, 1].map((y) => t[c - 1][y] + (t[c][y] - t[c - 1][y]) * w);
  });
}
function ts(t, e) {
  const { baseWeights: n, deformBase: s } = t, a = { bounceHz: 2.6, zeta: 0.25 }, o = e.legs ? 0.8 / ((Math.hypot(...e.legs.left.ankle.map((m, f) => m - e.legs.left.hip[f])) + Math.hypot(...e.legs.right.ankle.map((m, f) => m - e.legs.right.hip[f]))) / 2) : 1.6 / e.image.height, i = 0.8, c = (e.cloth ?? []).map((m) => {
    const f = ln(m), l = f.custom ? f.cols : m.columns ?? 8, p = f.custom ? f.rows : m.rows ?? 5, u = Gt(m.waist, l), v = Gt(m.hem, l), r = new Float64Array(p * l * 2);
    for (let x = 0; x < p; x++) for (let b = 0; b < l; b++) {
      const A = x / (p - 1), F = (x * l + b) * 2;
      r[F] = u[b][0] + (v[b][0] - u[b][0]) * A, r[F + 1] = u[b][1] + (v[b][1] - u[b][1]) * A;
    }
    f.custom && r.set(f.rest);
    const d = Array.from({ length: l }, (x, b) => {
      const A = b * 2, F = ((p - 1) * l + b) * 2;
      return !f.custom && Math.hypot(r[F] - r[A], r[F + 1] - r[A + 1]) <= 1;
    });
    return {
      grid: f,
      pinned: d,
      pendulums: (
        /** @type {ReturnType<typeof pendulumSystem>[]} */
        []
      ),
      systemKey: null,
      c: m,
      gravity: 9.80665 / (m.scale === void 0 ? o : m.scale / 1e3),
      tuning: Object.fromEntries(Object.entries({ ...mn, ...pn }).map(([x, b]) => [x, m[x] ?? b])),
      cols: l,
      rows: p,
      rest: r,
      top: f.custom ? f.top : u,
      weights: (f.custom ? f.top : u).map(([x, b]) => n(x, b, 0)),
      target: new Float64Array(r.length),
      previous: null,
      pivotVelocity: new Float64Array(l * 2),
      angle: new Float64Array(l),
      angularVelocity: new Float64Array(l),
      lowerAngle: new Float64Array(l),
      lowerAngularVelocity: new Float64Array(l),
      bounce: new Float64Array(l),
      bounceVelocity: new Float64Array(l),
      out: Float64Array.from(r),
      physicalOut: Float64Array.from(r),
      parent: null,
      parentLoc: null,
      meshes: []
    };
  }), w = Object.fromEntries(c.map((m) => [m.c.name, m]));
  function y(m, f, l) {
    const p = m.grid.custom || m.pinned.some(Boolean);
    let u = null;
    for (let v = 0; v < m.rows - 1; v++) for (let r = 0; r < m.cols - 1; r++) {
      const d = [(v * m.cols + r) * 2, (v * m.cols + r + 1) * 2, ((v + 1) * m.cols + r + 1) * 2, ((v + 1) * m.cols + r) * 2], [x, b, A, F, U, ne, X, G] = d.flatMap((j) => [m.rest[j], m.rest[j + 1]]);
      let R = 0.5, I = 0.5;
      for (let j = 0; j < 10; j++) {
        const Y = x * (1 - R) * (1 - I) + A * R * (1 - I) + U * R * I + X * (1 - R) * I - f, P = b * (1 - R) * (1 - I) + F * R * (1 - I) + ne * R * I + G * (1 - R) * I - l, N = (A - x) * (1 - I) + (U - X) * I, q = (F - b) * (1 - I) + (ne - G) * I, ae = (X - x) * (1 - R) + (U - A) * R, J = (G - b) * (1 - R) + (ne - F) * R, $ = N * J - q * ae;
        if (Math.abs($) < 1e-9) break;
        R -= (Y * J - P * ae) / $, I -= (N * P - q * Y) / $;
      }
      let B = Math.max(0, -R, R - 1) + Math.max(0, -I, I - 1);
      if (p) {
        const j = Math.max(0, Math.min(1, R)), Y = Math.max(0, Math.min(1, I)), P = x * (1 - j) * (1 - Y) + A * j * (1 - Y) + U * j * Y + X * (1 - j) * Y, N = b * (1 - j) * (1 - Y) + F * j * (1 - Y) + ne * j * Y + G * (1 - j) * Y;
        B = Math.hypot(P - f, N - l);
      }
      (!u || B < u.miss) && (u = { q: d, s: R, t: I, miss: B });
    }
    if (u.s = Math.min(p ? 1 : 4, Math.max(p ? 0 : -3, u.s)), u.t = Math.min(p ? 1 : 4, Math.max(p ? 0 : -3, u.t)), p) {
      const v = [0, 0];
      g(m.rest, u, v), u.offset = [f - v[0], l - v[1]];
    }
    return u;
  }
  function g(m, f, l) {
    const { q: p, s: u, t: v } = f, r = [(1 - u) * (1 - v), u * (1 - v), u * v, (1 - u) * v];
    l[0] = f.offset?.[0] ?? 0, l[1] = f.offset?.[1] ?? 0;
    for (let d = 0; d < 4; d++)
      l[0] += m[p[d]] * r[d], l[1] += m[p[d] + 1] * r[d];
    return l;
  }
  for (const m of c) m.c.parent && (m.parent = w[m.c.parent], m.parentLoc = m.top.map(([f, l]) => y(m.parent, f, l)));
  class h {
    constructor() {
      this.gain = 1, this.time = 0;
    }
    setTuning(f, l) {
      if (es(l), f !== null && !Object.hasOwn(w, f)) throw new RangeError(`Unknown cloth: ${f}`);
      for (const p of c) (f === null || p.c.name === f) && Object.assign(p.tuning, l);
    }
    /** Skin a layer mesh (rest/pos arrays in source px) to the named garment. */
    attach(f, l) {
      const p = w[f], u = [];
      for (let v = 0; v < l.rest.length; v += 2) u.push(y(p, l.rest[v], l.rest[v + 1]));
      p.meshes.push({ mesh: l, locs: u });
    }
    step(f, l, p) {
      if (l < 0) return;
      const u = Math.min(l, 0.05), v = Math.max(1, Math.ceil(u * 240)), r = u / v, d = [0, 0];
      for (const x of c) {
        const { cols: b, rows: A, rest: F, target: U, out: ne, angle: X, angularVelocity: G, lowerAngle: R, lowerAngularVelocity: I, bounce: B, bounceVelocity: j } = x, { stiffness: Y, damping: P, max: N, swing: q, follow: ae, cohesion: J, wind: $, responseGain: ee, tierGain: Z, highModeDamping: se } = x.tuning, re = this.gain * (ee ?? 1), te = new Float64Array(b * 2), oe = new Float64Array(b * 2), z = new Float64Array(b * 2);
        for (let L = 0; L < b; L++) {
          x.parent ? g(x.parent.physicalOut, x.parentLoc[L], d) : s(x.top[L][0], x.top[L][1], x.weights[L], f, p, d), te[L * 2] = d[0], te[L * 2 + 1] = d[1], x.parent && g(x.parent.out, x.parentLoc[L], d), oe[L * 2] = d[0], oe[L * 2 + 1] = d[1];
          for (let _ = 0; _ < 2; _++) {
            const D = L * 2 + _, O = x.previous && u > 0 ? (te[D] - x.previous[D]) / u : 0;
            z[D] = u > 0 ? (O - x.pivotVelocity[D]) / u : 0, x.pivotVelocity[D] = O;
          }
          for (let _ = 0; _ < A; _++) {
            const D = (_ * b + L) * 2;
            U[D] = F[D] + d[0] - x.top[L][0], U[D + 1] = F[D + 1] + d[1] - x.top[L][1];
          }
        }
        x.previous = te;
        const M = q * Math.sqrt(Y), T = 2 * Math.PI * a.bounceHz;
        if (x.grid.custom) {
          const L = `${M}:${P}:${se}`;
          if (x.systemKey !== L) {
            const H = x.pendulums;
            x.pendulums = x.grid.lengths.map((E, k) => {
              const C = x.grid.joints[k], V = Kn(C.slice(1).map((Q, ie) => (Q - C[ie]) * E * i), x.gravity * M ** 2, a.zeta * P, se);
              return H[k] && (V.angles = H[k].angles, V.velocities = H[k].velocities), V;
            }), x.systemKey = L;
          }
          const _ = Math.max(...x.pendulums.flatMap((H) => H.frequencies)), D = Math.max(v, Math.ceil(u * _ * 32)), O = u / D;
          for (let H = 0; H < D; H++) {
            const E = this.time + (H + 1) * O, k = (Math.sin(E * 1.1) * 0.6 + Math.sin(E * 2.3) * 0.4) * N * $;
            for (let C = 0; C < b; C++) {
              const V = z[C * 2 + 1], Q = Math.max(x.gravity * 0.1, x.gravity - V), ie = Math.max(-8 * x.gravity, Math.min(8 * x.gravity, z[C * 2])) - Q * k / x.grid.lengths[C];
              Qn(x.pendulums[C], O, ie, Q / x.gravity), j[C] += (-(T ** 2) * B[C] - 2 * T * j[C] - V * 0.15) * O, B[C] += j[C] * O;
            }
          }
          for (let H = 0; u > 0 && H < J; H++) for (const E of ["angles", "velocities"]) {
            const k = x.pendulums.map((C) => [...C[E]]);
            x.pendulums.forEach((C, V) => {
              C[E] = k[V].map((Q, ie) => 0.5 * Q + 0.25 * (k[Math.max(0, V - 1)][ie] + k[Math.min(b - 1, V + 1)][ie]));
            });
          }
          const W = (H, E, k, C = 1) => {
            for (let V = 0; V < b; V++) {
              const Q = x.grid.joints[V], ie = x.grid.seams[V], ce = x.grid.lengths[V], ge = N * 0.1 * Math.tanh(B[V] * k / (N * 0.1)), _e = 2 * Math.asin(Math.min(0.95, (N - Math.abs(ge)) / (2 * ce))), je = x.pendulums[V].angles[0], ye = x.pendulums[V].angles.map((le) => {
                const de = C === 1 ? le : je + (le - je) * C;
                return _e * Math.tanh(de * k / _e);
              }), K = [Array.from(E.slice(V * 2, V * 2 + 2))];
              for (let le = 0; le < ye.length; le++) {
                const de = Ze(ie, Q[le]), me = Ze(ie, Q[le + 1]), xe = me[0] - de[0], be = me[1] - de[1], Me = ye[le];
                K.push([K[le][0] + xe * Math.cos(Me) + be * Math.sin(Me), K[le][1] - xe * Math.sin(Me) + be * Math.cos(Me)]);
              }
              for (let le = 0; le < A; le++) {
                const de = x.grid.fractions[V][le];
                let me = 0;
                for (; me < ye.length - 1 && de > Q[me + 1] + 1e-9; ) me++;
                const xe = Ze(ie, Q[me]), be = Ze(ie, de), Me = (de - Q[me]) / (Q[me + 1] - Q[me]), Le = ye[me] * (1 - 0.1 * (1 - ae) * (1 - Me)), ze = be[0] - xe[0], Ke = be[1] - xe[1], It = (le * b + V) * 2;
                H[It] = K[me][0] + ze * Math.cos(Le) + Ke * Math.sin(Le), H[It + 1] = K[me][1] - ze * Math.sin(Le) + Ke * Math.cos(Le) + ge * de;
              }
            }
          };
          W(x.physicalOut, te, 1), W(ne, oe, re, Z);
          continue;
        }
        for (let L = 0; L < v; L++) {
          const _ = this.time + (L + 1) * r, D = (Math.sin(_ * 1.1) * 0.6 + Math.sin(_ * 2.3) * 0.4) * N * $;
          for (let O = 0; O < b; O++) {
            if (x.pinned[O]) continue;
            const W = O * 2, H = ((A - 1) * b + O) * 2, E = Math.max(1, Math.hypot(F[H] - F[W], F[H + 1] - F[W + 1])), k = Math.max(x.gravity * 0.1, x.gravity - z[W + 1]), C = i * E / 2, V = k / C * M * M, Q = Math.sqrt(V), ie = a.zeta * P, ce = Q * Math.sqrt(2 - Math.SQRT2), ge = Q * Math.sqrt(2 + Math.SQRT2), _e = 2 * ie * ce * ge / (ce + ge), je = 2 * ie / (ce + ge), ye = X[O] - R[O], K = Math.cos(ye), le = Math.sin(ye), de = G[O], me = I[O], xe = (Math.max(-8 * x.gravity, Math.min(8 * x.gravity, z[W])) - k * D / E) / C, be = _e * (2 * de + K * me) + je * 2 * V * de, Me = _e * (K * de + me) + je * V * me, Le = -2 * V * Math.sin(X[O]) - le * me * me - 2 * xe * Math.cos(X[O]) - be, ze = -V * Math.sin(R[O]) + le * de * de - xe * Math.cos(R[O]) - Me, Ke = 2 - K * K;
            G[O] += (Le - K * ze) / Ke * r, I[O] += (2 * ze - K * Le) / Ke * r, X[O] += G[O] * r, R[O] += I[O] * r, j[O] += (-T * T * B[O] - 2 * T * j[O] - z[W + 1] * 0.15) * r, B[O] += j[O] * r;
          }
        }
        for (let L = 0; u > 0 && L < J; L++) for (const _ of [X, G, R, I]) {
          const D = _.slice();
          for (let O = 0; O < b; O++) _[O] = x.pinned[O] ? 0 : D[O] * 0.5 + (D[Math.max(0, O - 1)] + D[Math.min(b - 1, O + 1)]) * 0.25;
        }
        const S = (L, _, D) => {
          for (let O = 0; O < b; O++) {
            const W = O * 2, H = ((A - 1) * b + O) * 2;
            if (x.pinned[O]) {
              for (let ye = 0; ye < A; ye++) {
                const K = (ye * b + O) * 2;
                L[K] = F[K] + _[W] - F[W], L[K + 1] = F[K + 1] + _[W + 1] - F[W + 1];
              }
              continue;
            }
            const E = Math.max(1, Math.hypot(F[H] - F[W], F[H + 1] - F[W + 1])), k = N * 0.1 * Math.tanh(B[O] * D / (N * 0.1)), C = 2 * Math.asin(Math.min(0.95, (N - Math.abs(k)) / (2 * E))), V = C * Math.tanh(X[O] * D / C), Q = C * Math.tanh(R[O] * D / C), ie = 0.1 * (1 - ae), ce = (F[H] - F[W]) / 2, ge = (F[H + 1] - F[W + 1]) / 2, _e = _[W] + ce * Math.cos(V) + ge * Math.sin(V), je = _[W + 1] - ce * Math.sin(V) + ge * Math.cos(V);
            for (let ye = 0; ye < A; ye++) {
              const K = ye / (A - 1), le = (ye * b + O) * 2, de = K <= 0.5, me = de ? K * 2 : (K - 0.5) * 2, xe = (de ? V : Q) * (1 - ie + ie * me), be = Math.cos(xe), Me = Math.sin(xe), Le = ce * me, ze = ge * me;
              L[le] = (de ? _[W] : _e) + Le * be + ze * Me, L[le + 1] = (de ? _[W + 1] : je) - Le * Me + ze * be + k * K;
            }
          }
        };
        S(x.physicalOut, te, 1), S(ne, oe, re);
      }
      this.time += u;
    }
    deform() {
      const f = [0, 0];
      for (const l of c) for (const { mesh: p, locs: u } of l.meshes)
        for (let v = 0; v < u.length; v++)
          g(l.out, u[v], f), p.pos[v * 2] = f[0], p.pos[v * 2 + 1] = f[1];
    }
    /** Grid nodes per garment, for debug overlays. */
    get grids() {
      return c.map((f) => ({ name: f.c.name, cols: f.cols, rows: f.rows, nodes: f.out }));
    }
  }
  return { Cloth: h, garments: c };
}
function ns(t, e) {
  const { baseWeights: n, deformBase: s, MOUTH: a } = t, o = (b, A, F) => {
    const U = Math.min(1, Math.max(0, (F - b) / (A - b)));
    return U * U * (3 - 2 * U);
  }, i = e.mouth.area, c = {
    a: { sprite: "mouth_a", ref: 0.9, width: 1 },
    aHalf: { sprite: "mouth_a_half", ref: 0.55, width: 1 },
    i: { sprite: "mouth_i", ref: 0.55, width: 1 },
    e: { sprite: "mouth_a_half", ref: 0.65, width: 1.06 },
    o: { sprite: "mouth_o", ref: 0.75, width: 1 },
    u: { sprite: "mouth_o", ref: 0.75, width: 0.78 }
  }, w = 0.16, y = ["angry", "sad"];
  function g(b, A) {
    const F = (X, G, R) => X >= G - (A ? 0.07 : 0) && X < R + (A ? 0.07 : 0), U = [["i", -9, -0.55], ["e", -0.55, -0.2], ["a", -0.2, 0.35], ["o", 0.35, 0.75], ["u", 0.75, 9]], ne = A && U.find((X) => X[0] === A || A === "aHalf" && X[0] === "a");
    return ne && F(b, ne[1], ne[2]) ? ne[0] : U.find((X) => b >= X[1] && b < X[2])[0];
  }
  const h = 0.75, m = 0.3, f = 0.06, l = ["sad", "surprise"];
  function p(b, A, F = null) {
    return F && b >= m ? F : b >= h ? null : b < m ? A >= 0.5 ? "eyes_smile" : "eyes_closed" : "eyes_half";
  }
  function u(b, A, F = null) {
    if (b < w) return null;
    const U = g(A, F);
    return U === "a" ? b >= 0.6 ? "a" : "aHalf" : U;
  }
  function v(b) {
    return a.cy + (b - a.cx) * Math.tan(a.angle);
  }
  function r() {
    return i.cx;
  }
  function d(b, A) {
    const F = Math.cos(-i.angle), U = Math.sin(-i.angle), ne = b - i.cx, X = A - i.cy, G = (ne * F - X * U) / i.rx, R = (ne * U + X * F) / i.ry;
    return 1 - o(0.55, 0.95, Math.hypot(G, R));
  }
  function x(b, A, F, U, ne) {
    const X = {}, G = ($) => $.startsWith("eyes_closed") || $.startsWith("eyes_smile"), R = ($) => y.some((ee) => $ === `mouth_${ee}`), I = ($) => G($) ? 1 : $.startsWith("eyes_") ? 0 : R($) ? 2 : 3, B = Object.entries(A.layers).sort(($, ee) => I($[0]) - I(ee[0]));
    for (const [$, ee] of B) {
      const Z = U(ee, e.mesh.spriteCell, ne(F[$]), F[$].width), se = [], re = [];
      for (let z = 0; z < Z.rest.length / 2; z++) {
        const M = Z.rest[z * 2], T = Z.rest[z * 2 + 1];
        se.push(n(M, T, 0)), re.push($.startsWith("mouth") ? d(M, T) : 0);
      }
      const te = $ === "eyes_half_0" ? 0 : $ === "eyes_half_1" ? 1 : void 0, oe = b.addLayer($, F[$], Z, { color: [0.4, 1, 0.8, 0.6], halfEye: te });
      oe.visible = !1, X[$] = { mesh: Z, W: se, inner: re, layer: oe };
    }
    const j = [0, 1].map(($) => !!(X[`eyes_closed_${$}`] && X[`eyes_half_${$}`])), Y = Object.values(c).some(($) => X[$.sprite]), P = ($, ee) => ($ === "eyes_smile" && !X[`eyes_smile_${ee}`] && ($ = "eyes_closed"), $ === "open" || X[`${$}_${ee}`] ? $ : "open"), N = [0, 0];
    let q = null;
    const ae = [0, 1].map(() => ({ cur: "open", prev: "open", t: 1 }));
    function J($, ee, Z, se, re = 1) {
      const te = $.mesh.rest, oe = $.mesh.pos;
      for (let z = 0; z < $.W.length; z++) {
        let M = te[z * 2], T = te[z * 2 + 1];
        const S = $.inner[z];
        if (S > 0) {
          const L = v(M);
          T = L + (T - L) * (1 + (se - 1) * S), M = r() + (M - r()) * (1 + (re - 1) * S);
        }
        s(M, T, $.W[z], ee, Z, N), oe[z * 2] = N[0], oe[z * 2 + 1] = N[1];
      }
    }
    return {
      /**
       * Show / hide and deform the sprites for this frame.
       * Returns which eyes are covered by a sprite, so the layered eye parts can be hidden, and
       * whether a drawing shows the mouth, so the shader mouth can be left out.
       * `mood` (angry / sad / surprise) picks drawn expression eyes (sad, surprise) and closed
       * mouths (angry, sad) when the avatar has them.
       */
      update($, ee, Z = 1 / 60, se = null) {
        for (const T of Object.values(X)) T.layer.visible = !1;
        const re = [!1, !1];
        [
          [$.eyeROpen, $.eyeSmile],
          [$.eyeLOpen, $.eyeSmileL ?? $.eyeSmile]
        ].forEach(([T, S], L) => {
          const _ = ae[L], D = l.includes(se) && X[`eyes_${se}_${L}`] ? `eyes_${se}` : null, O = P(p(T, S, D) ?? "open", L);
          O !== _.cur && (_.prev = _.cur, _.cur = O, _.t = 0), _.t = Z > 0 ? Math.min(1, _.t + Z / f) : 1;
          const W = o(0, 1, _.t), H = (k, C) => {
            if (k === "open" || C <= 1e-3) return;
            const V = X[`${k}_${L}`];
            V && (V.layer.visible = !0, V.layer.alpha = C, J(V, $, ee, 1));
          }, E = (k) => k === "open" ? -1 : G(k) ? 1 : 0;
          _.t >= 1 ? H(_.cur, 1) : E(_.cur) > E(_.prev) ? (H(_.prev, 1), H(_.cur, W)) : (H(_.cur, 1), H(_.prev, 1 - W)), re[L] = _.cur !== "open" && W >= 0.999;
        });
        const te = u($.mouthOpen, $.mouthForm, q);
        q = te;
        const oe = te && c[te], z = oe && X[oe.sprite], M = y.includes(se) && X[`mouth_${se}`];
        if (M && (!z || $.mouthOpen < w + 0.04) && (M.layer.visible = !0, M.layer.alpha = 1, J(M, $, ee, 1)), z) {
          z.layer.visible = !0, z.layer.alpha = o(w, w + 0.04, $.mouthOpen);
          const T = Math.min(1.1, Math.max(0.5, $.mouthOpen / oe.ref));
          J(z, $, ee, T, oe.width);
        }
        return { eyes: re, mouth: te, mouthDrawn: Y && (!oe || !!z) };
      },
      /** Whether each eye has the closed and half-closed drawings, so the layered eye stays open. */
      eyesDrawn: j
    };
  }
  return { createSprites: x, mouthShape: u, eyeSprite: p };
}
const Vt = { angry: "angry", angryTalk: "angry", sad: "sad", sadTalk: "sad", surprise: "surprise", surprisedTalk: "surprise" };
function ss(t, e) {
  return t && t !== "neutral" ? Vt[t] ?? null : (e && Vt[e]) ?? null;
}
function as(t, e, n, s = 6) {
  let a = e, o = n, i = -1, c = -1;
  for (let g = 0; g < n; g++) {
    const h = g * e;
    for (let m = 0; m < e; m++)
      t[h + m] > 3 && (m < a && (a = m), m > i && (i = m), g < o && (o = g), g > c && (c = g));
  }
  if (i < 0) return null;
  const w = Math.max(0, a - s), y = Math.max(0, o - s);
  return [w, y, Math.min(e, i + 1 + s) - w, Math.min(n, c + 1 + s) - y];
}
function rs(t, e, n, s, a, o, i = 16, c, w, y) {
  const g = /* @__PURE__ */ new Map();
  for (const h of e.overlays) {
    const m = n[h.name];
    if (c !== void 0 && m.width !== c || w !== void 0 && m.height !== w)
      throw new Error(`overlay ${h.name}: image size does not match base.png`);
    const f = a(m), l = as(f, m.width, m.height);
    if (!l) continue;
    const [p, u, v, r] = l, d = new Uint8Array(v * r);
    for (let F = 0; F < r; F++) d.set(f.subarray((u + F) * m.width + p, (u + F) * m.width + p + v), F * v);
    const x = s(l, i, d, v), b = [];
    for (let F = 0; F < x.rest.length; F += 2) {
      const U = o(x.rest[F], x.rest[F + 1], 0);
      b.push({ ...U, brow: 0, jaw: 0 });
    }
    const A = t.addLayer(`overlay_${h.name}`, y(m, l), x);
    A.visible = !1, g.set(h.name, { mesh: x, weights: b, layer: A });
  }
  return {
    /** Shows the named overlays and hides the rest. Unknown names are ignored. */
    set(h) {
      const m = new Set(h);
      for (const [f, l] of g) l.layer.visible = m.has(f);
    },
    update(h, m, f, l) {
      for (const { mesh: p, weights: u, layer: v } of g.values())
        if (v.visible)
          for (let r = 0; r < u.length; r++)
            f(p.rest[r * 2], p.rest[r * 2 + 1], u[r], h, m, l), p.pos[r * 2] = l[0], p.pos[r * 2 + 1] = l[1];
    }
  };
}
function Ut(t) {
  if (!t || typeof t != "object" || Array.isArray(t)) throw new TypeError("lipSync: expected an object");
  const e = t, n = {};
  for (const s of ["granularity", "openness", "closeSpeed"]) {
    const a = e[s];
    if (a !== void 0) {
      if (typeof a != "number" || !Number.isFinite(a) || a < 0 || a > 1)
        throw new RangeError(`lipSync.${s}: expected 0–1`);
      n[s] = a;
    }
  }
  if (e.preset !== void 0) {
    if (!["calm", "default", "lively", "subtle", "big", "custom"].includes(e.preset))
      throw new RangeError("lipSync.preset: expected calm, default, lively, subtle, big or custom");
    n.preset = e.preset;
  }
  return n;
}
function Ht(t = {}, e = {
  granularity: 0.5,
  openness: 0.5,
  closeSpeed: 0.5
}) {
  const n = Ut(t);
  return {
    granularity: n.granularity ?? e.granularity,
    openness: n.openness ?? e.openness,
    closeSpeed: n.closeSpeed ?? e.closeSpeed
  };
}
const Pe = (t, e, n, s) => t === 0.5 ? n : t < 0.5 ? e + (n - e) * t * 2 : n + (s - n) * (t - 0.5) * 2;
function qt(t) {
  return {
    arm: Pe(t.granularity, 0.2, 0.6, 0.9),
    trigger: Pe(t.granularity, 0.65, 0.8, 0.95),
    relax: Pe(t.granularity, 1.5, 5, 12),
    range: Pe(t.granularity, 0.7, 0.3, 0.05),
    risePower: Pe(t.granularity, 0.05, 0.3, 0.8),
    openness: Pe(t.openness, 0.55, 1, 1.25),
    audioRelease: Pe(t.closeSpeed, 6, 32, 45),
    kanaRelease: Pe(t.closeSpeed, 6, 22, 45)
  };
}
const os = /* @__PURE__ */ new Set([
  "angleX",
  "angleY",
  "angleZ",
  "bodyAngleX",
  "bodyAngleZ",
  "armAngle",
  "handAngle",
  "gazeX",
  "gazeY"
]), Xt = {
  nod: {
    label: "Nod",
    dur: 1.7,
    tracks: {
      angleY: [[0, 0], [0.32, -13], [0.62, 2], [0.95, -9], [1.3, 1], [1.7, 0]],
      angleZ: [[0, 0], [0.4, -2], [1, -1], [1.7, 0]],
      bodyAngleX: [[0, 0], [0.5, -1.5], [1.7, 0]],
      eyeSmile: [[0, 0], [0.3, 0.45], [1.3, 0.45], [1.7, 0]],
      eyeOpen: [[0, 1], [0.3, 0.72], [1.3, 0.72], [1.7, 1]],
      mouthOpen: [[0, 0], [0.3, 0.12], [1.3, 0.12], [1.7, 0]],
      mouthForm: [[0, 0], [0.3, -0.6], [1.7, -0.3]]
    }
  },
  tilt: {
    label: "Head tilt",
    dur: 2.6,
    tracks: {
      angleZ: [[0, 0], [0.55, 17], [2, 15], [2.6, 0]],
      angleX: [[0, 0], [0.6, 8], [2, 7], [2.6, 0]],
      angleY: [[0, 0], [0.6, 4], [2.6, 0]],
      bodyAngleZ: [[0, 0], [0.8, 3], [2, 3], [2.6, 0]],
      gazeX: [[0, 0], [0.4, 0.5], [2.1, 0.4], [2.6, 0]],
      gazeY: [[0, 0], [0.4, 0.35], [2.1, 0.3], [2.6, 0]],
      browAngle: [[0, 0], [0.5, -0.7], [2.1, -0.6], [2.6, 0]],
      browY: [[0, 0], [0.5, 0.35], [2.1, 0.3], [2.6, 0]]
      // closed mouth: a barely open round mouth read as a squashed blob
    }
  },
  think: {
    label: "Thinking",
    dur: 3.6,
    tracks: {
      angleX: [[0, 0], [0.7, -11], [3, -9], [3.6, 0]],
      angleY: [[0, 0], [0.7, 9], [3, 8], [3.6, 0]],
      angleZ: [[0, 0], [0.8, 6], [3, 5], [3.6, 0]],
      gazeX: [[0, 0], [0.35, -0.8], [3.1, -0.7], [3.6, 0]],
      gazeY: [[0, 0], [0.35, 0.7], [3.1, 0.6], [3.6, 0]],
      handAngle: [[0, 0], [0.6, 3], [3, 3], [3.6, 0]],
      fingerTap: [
        [0, 0],
        [0.9, 0],
        [1.05, 1],
        [1.2, 0],
        [1.4, 1],
        [1.55, 0],
        [1.75, 1],
        [1.9, 0],
        [2.3, 0],
        [2.45, 1],
        [2.6, 0],
        [3.6, 0]
      ],
      browY: [[0, 0], [0.6, 0.25], [3, 0.2], [3.6, 0]],
      browAngle: [[0, 0], [0.6, -0.3], [3, -0.3], [3.6, 0]],
      mouthForm: [[0, 0], [0.6, 0.4], [3.6, 0]]
    }
  },
  giggle: {
    label: "Chuckle",
    dur: 2.2,
    tracks: {
      eyeOpen: [[0, 1], [0.2, 0], [1.8, 0], [2.2, 1]],
      eyeSmile: [[0, 0], [0.2, 1], [1.8, 1], [2.2, 0]],
      mouthOpen: [[0, 0], [0.2, 0.5], [0.45, 0.32], [0.7, 0.55], [0.95, 0.34], [1.2, 0.5], [1.8, 0.3], [2.1, 0]],
      mouthForm: [[0, 0], [0.2, -0.8], [2.2, -0.2]],
      blush: [[0, 0], [0.3, 0.7], [1.8, 0.7], [2.2, 0.1]],
      angleY: [[0, 0], [0.2, -5], [0.45, -1], [0.7, -6], [0.95, -2], [1.2, -5], [1.6, -2], [2.2, 0]],
      angleZ: [[0, 0], [0.3, -6], [1.8, -5], [2.2, 0]],
      bodyAngleZ: [[0, 0], [0.25, 2], [0.5, -1], [0.75, 2], [1, -1], [1.3, 1.5], [2.2, 0]],
      browY: [[0, 0], [0.3, 0.3], [1.8, 0.3], [2.2, 0]]
    }
  },
  surprise: {
    label: "Surprise",
    dur: 2,
    tracks: {
      angleY: [[0, 0], [0.12, 10], [0.5, 6], [1.5, 5], [2, 0]],
      angleX: [[0, 0], [0.12, -4], [2, 0]],
      bodyAngleX: [[0, 0], [0.15, -4], [1.5, -3], [2, 0]],
      eyeOpen: [[0, 1], [0.1, 1.25], [1.5, 1.2], [2, 1]],
      browY: [[0, 0], [0.1, 1], [1.5, 0.9], [2, 0]],
      mouthOpen: [[0, 0], [0.12, 0.6], [1.4, 0.45], [2, 0]],
      mouthForm: [[0, 0], [0.12, 0.6], [1.5, 0.55], [2, 0]],
      // o
      armAngle: [[0, 0], [0.15, -4], [1.5, -3], [2, 0]]
    }
  },
  shy: {
    label: "Shy",
    dur: 3.2,
    tracks: {
      angleX: [[0, 0], [0.6, 14], [2.6, 12], [3.2, 0]],
      angleY: [[0, 0], [0.6, -9], [2.6, -8], [3.2, 0]],
      angleZ: [[0, 0], [0.7, -8], [2.6, -7], [3.2, 0]],
      gazeX: [[0, 0], [0.3, 0.8], [1.6, 0.8], [1.9, -0.3], [2.2, 0.8], [2.8, 0.6], [3.2, 0]],
      gazeY: [[0, 0], [0.3, -0.5], [2.8, -0.4], [3.2, 0]],
      eyeOpen: [[0, 1], [0.5, 0.75], [2.7, 0.75], [3.2, 1]],
      eyeSmile: [[0, 0], [0.5, 0.5], [2.7, 0.5], [3.2, 0]],
      blush: [[0, 0], [0.8, 1], [2.7, 1], [3.2, 0]],
      browAngle: [[0, 0], [0.5, -0.6], [2.7, -0.5], [3.2, 0]],
      mouthForm: [[0, 0], [0.5, -0.4], [3.2, 0]],
      handAngle: [[0, 0], [0.8, 4], [2.6, 4], [3.2, 0]]
    }
  },
  no: {
    label: "Shake head",
    dur: 1.9,
    tracks: {
      angleX: [[0, 0], [0.2, 13], [0.45, -13], [0.7, 12], [0.95, -10], [1.2, 5], [1.5, 0]],
      angleY: [[0, 0], [0.2, -3], [1.3, -3], [1.9, 0]],
      bodyAngleX: [[0, 0], [0.3, 1.5], [0.6, -1.5], [0.9, 1], [1.3, 0]],
      eyeOpen: [[0, 1], [0.15, 0], [1.4, 0], [1.9, 1]],
      eyeSmile: [[0, 0], [0.15, 1], [1.4, 1], [1.9, 0]],
      // closed mouth while shaking the head
      browAngle: [[0, 0], [0.2, -0.5], [1.4, -0.5], [1.9, 0]]
    }
  },
  wink: {
    label: "Wink",
    dur: 2,
    tracks: {
      angleZ: [[0, 0], [0.35, -13], [1.5, -12], [2, 0]],
      angleX: [[0, 0], [0.35, 9], [1.5, 8], [2, 0]],
      bodyAngleZ: [[0, 0], [0.5, -2], [1.5, -2], [2, 0]],
      eyeOpenL: [[0, 1], [0.25, 1], [0.4, 0], [1.4, 0], [1.6, 1]],
      eyeSmileL: [[0, 0], [0.3, 1], [1.5, 1], [1.7, 0]],
      mouthOpen: [[0, 0], [2, 0]],
      // wink with a closed smile
      mouthForm: [[0, 0], [0.35, -0.8], [2, 0]],
      blush: [[0, 0], [0.4, 0.5], [1.6, 0.5], [2, 0]]
    }
  },
  greet: {
    label: "Greeting",
    dur: 2.6,
    tracks: {
      angleY: [[0, 0], [0.7, -18], [1.2, -17], [1.9, 2], [2.6, 0]],
      bodyAngleX: [[0, 0], [0.8, 2], [1.8, 0]],
      bodyAngleZ: [[0, 0], [0.8, 1.5], [2, 0]],
      armAngle: [[0, 0], [0.8, 3], [2, 0]],
      eyeOpen: [[0, 1], [0.5, 0], [1.4, 0], [1.8, 1]],
      eyeSmile: [[0, 0], [0.5, 1], [1.6, 1], [2.3, 0.4], [2.6, 0]],
      mouthOpen: [[0, 0], [1.6, 0], [1.8, 0.3], [2.3, 0.2], [2.6, 0]],
      mouthForm: [[0, 0], [1.6, -0.8], [2.6, -0.3]],
      blush: [[0, 0], [1.6, 0.3], [2.6, 0]]
    }
  }
}, zt = {
  lookAround: {
    label: "Look around",
    dur: 5.2,
    idle: !0,
    tracks: {
      gazeX: [[0, 0], [0.25, -0.85], [1.5, -0.8], [1.8, 0.1], [2.1, 0.85], [3.4, 0.8], [3.7, 0], [5.2, 0]],
      gazeY: [[0, 0], [0.25, 0.15], [1.8, 0.25], [2.1, 0.1], [3.7, 0], [5.2, 0]],
      angleX: [[0, 0], [0.7, -20], [1.6, -18], [2.5, 19], [3.5, 17], [4.4, 0], [5.2, 0]],
      angleY: [[0, 0], [0.7, 3], [1.8, 5], [2.5, 3], [4.4, 0]],
      angleZ: [[0, 0], [0.8, 4], [1.8, 0], [2.6, -4], [4.4, 0]],
      bodyAngleX: [[0, 0], [1, -4], [2.8, 4], [4.6, 0]],
      bodyAngleZ: [[0, 0], [1, 1.5], [2.8, -1.5], [4.6, 0]],
      handAngle: [[0, 0], [1, -2], [2.8, 2], [4.6, 0]],
      browY: [[0, 0], [0.5, 0.35], [3.6, 0.3], [4.4, 0]],
      // curious: a quick inhale, held while looking, let out at the end
      breath: [[0, 0.2], [0.6, 0.85], [3.6, 0.7], [4.6, 0], [5.2, 0.1]]
    }
  },
  glance: {
    label: "Side glance",
    dur: 4.6,
    idle: !0,
    tracks: {
      gazeX: [[0, 0], [0.18, 0.9], [2.6, 0.85], [2.9, 0.15], [3.2, 0], [4.6, 0]],
      gazeY: [[0, 0], [0.18, 0.4], [2.6, 0.35], [3.2, 0]],
      angleX: [[0, 0], [0.6, 13], [2.6, 11], [3.6, 0]],
      angleY: [[0, 0], [0.6, 6], [2.6, 5], [3.6, 0]],
      angleZ: [[0, 0], [0.7, -5], [2.6, -4], [3.6, 0]],
      bodyAngleX: [[0, 0], [1, 2.5], [2.8, 2], [4, 0]],
      eyeOpen: [[0, 1], [0.3, 1.06], [2.5, 1.05], [2.8, 0.85], [3.4, 1]],
      browY: [[0, 0], [0.4, 0.4], [2.5, 0.35], [3.4, 0]],
      browAngle: [[0, 0], [0.4, -0.2], [2.5, -0.2], [3.4, 0]],
      breath: [[0, 0], [0.5, 0.6], [2.6, 0.55], [3.8, 0], [4.6, 0.3]]
    }
  },
  sway: {
    label: "Sway",
    dur: 7,
    idle: !0,
    tracks: {
      bodyAngleZ: [[0, 0], [1.6, 6], [3.4, -6], [5.2, 5], [7, 0]],
      bodyAngleX: [[0, 0], [1.6, 3], [3.4, -3], [5.2, 2.5], [7, 0]],
      angleZ: [[0, 0], [1.8, -10], [3.6, 10], [5.4, -8], [7, 0]],
      angleX: [[0, 0], [1.8, 6], [3.6, -6], [5.4, 5], [7, 0]],
      angleY: [[0, 0], [0.9, 3], [1.8, 0], [2.7, 3], [3.6, 0], [4.5, 3], [5.4, 0], [7, 0]],
      armAngle: [[0, 0], [1.6, 3], [3.4, -3], [5.2, 2], [7, 0]],
      handAngle: [[0, 0], [1.8, -4], [3.6, 4], [5.4, -3], [7, 0]],
      gazeX: [[0, 0], [1.8, -0.3], [3.6, 0.3], [5.4, -0.2], [7, 0]],
      eyeOpen: [[0, 1], [0.8, 0.82], [6.2, 0.82], [7, 1]],
      eyeSmile: [[0, 0], [0.8, 0.35], [6.2, 0.35], [7, 0]],
      // slow, even breaths in time with the sway
      breath: [[0, 0], [0.9, 1], [1.8, 0], [2.7, 1], [3.6, 0], [4.5, 1], [5.4, 0], [6.3, 0.8], [7, 0]]
    }
  },
  sigh: {
    label: "Sigh",
    dur: 5.6,
    idle: !0,
    tracks: {
      breath: [[0, 0], [1.3, 1.25], [1.9, 1.25], [3.6, 0], [5.6, 0]],
      angleY: [[0, 0], [1.3, 9], [1.9, 9], [3.3, -9], [4.6, -6], [5.6, 0]],
      angleZ: [[0, 0], [1.3, -3], [3.3, 5], [5.6, 0]],
      bodyAngleX: [[0, 0], [1.3, -2.5], [3.3, 2.5], [5.6, 0]],
      bodyAngleZ: [[0, 0], [1.9, 1], [3.3, -1.5], [5.6, 0]],
      armAngle: [[0, 0], [1.3, -2.5], [3.3, 2], [5.6, 0]],
      gazeY: [[0, 0], [1.2, 0.4], [2, 0.3], [3.2, -0.4], [4.8, -0.2], [5.6, 0]],
      eyeOpen: [[0, 1], [1, 0.95], [1.9, 0.6], [3.4, 0.6], [4.6, 0.78], [5.6, 1]],
      browY: [[0, 0], [1.3, 0.35], [3.2, -0.2], [5.6, 0]],
      browAngle: [[0, 0], [1.9, -0.4], [4.6, -0.35], [5.6, 0]]
    }
  },
  doze: {
    label: "Drowsy",
    dur: 7.2,
    idle: !0,
    tracks: {
      eyeOpen: [[0, 1], [1.8, 0.78], [3.2, 0.62], [4.5, 0.55], [4.75, 1.1], [5.6, 1.05], [7.2, 1]],
      angleY: [[0, 0], [1.8, -6], [3.2, -9], [4.5, -17], [4.75, 5], [5.6, 2], [7.2, 0]],
      angleZ: [[0, 0], [2, 4], [4.5, 10], [4.75, -2], [7.2, 0]],
      angleX: [[0, 0], [4.5, -4], [4.75, 3], [5.4, -6], [6.2, 5], [7.2, 0]],
      bodyAngleZ: [[0, 0], [4.5, 3], [4.8, -2], [7.2, 0]],
      bodyAngleX: [[0, 0], [4.5, 2], [4.8, -1.5], [7.2, 0]],
      armAngle: [[0, 0], [4.5, 3], [4.8, -2], [7.2, 0]],
      handAngle: [[0, 0], [4.5, 5], [4.8, -1], [7.2, 0]],
      gazeY: [[0, 0], [4.5, -0.4], [4.75, 0.2], [7.2, 0]],
      gazeX: [[0, 0], [4.8, 0], [5.3, -0.6], [6.1, 0.6], [6.8, 0]],
      browY: [[0, 0], [4.5, -0.35], [4.75, 0.8], [5.8, 0.3], [7.2, 0]],
      // long, slow, deepening breaths; a sharp inhale on waking
      breath: [[0, 0], [1.1, 0.7], [2.6, 0], [3.8, 0.6], [4.5, 0.2], [4.8, 1.1], [6, 0.2], [7.2, 0]]
    }
  },
  stretch: {
    label: "Stretch",
    dur: 6.2,
    idle: !0,
    tracks: {
      angleZ: [[0, 0], [1.3, -22], [2.3, -21], [3.8, 20], [4.8, 19], [6.2, 0]],
      angleY: [[0, 0], [1.3, 5], [2.3, 7], [3.1, -3], [3.8, 5], [4.8, 6], [6.2, 0]],
      angleX: [[0, 0], [1.3, -5], [3.8, 5], [6.2, 0]],
      bodyAngleZ: [[0, 0], [1.3, 4], [3.8, -4], [6.2, 0]],
      bodyAngleX: [[0, 0], [1.3, -2], [3.8, 2], [6.2, 0]],
      armAngle: [[0, 0], [1.3, 2], [3.8, -2], [6.2, 0]],
      eyeOpen: [[0, 1], [0.8, 0.62], [4.9, 0.62], [5.6, 1]],
      browAngle: [[0, 0], [1, -0.3], [4.9, -0.3], [5.8, 0]],
      breath: [[0, 0], [1.3, 1.1], [2.3, 0.9], [3.1, 0.2], [3.8, 1.1], [4.8, 0.9], [6.2, 0]]
    }
  },
  lean: {
    label: "Peek",
    dur: 4.8,
    idle: !0,
    tracks: {
      bodyAngleX: [[0, 0], [0.9, 6], [3.4, 6], [4.4, 0]],
      bodyAngleZ: [[0, 0], [0.9, -3], [3.4, -3], [4.4, 0]],
      angleX: [[0, 0], [0.9, 9], [2, 7], [2.6, 10], [3.4, 8], [4.4, 0]],
      angleY: [[0, 0], [0.9, -6], [3.4, -5], [4.4, 0]],
      angleZ: [[0, 0], [0.9, 10], [2.2, 12], [3.4, 9], [4.4, 0]],
      armAngle: [[0, 0], [0.9, -3], [3.4, -3], [4.4, 0]],
      handAngle: [[0, 0], [0.9, 3], [3.4, 3], [4.4, 0]],
      gazeY: [[0, 0], [0.6, 0.45], [3.4, 0.4], [4.2, 0]],
      gazeX: [[0, 0], [1.5, 0], [1.8, -0.3], [2.3, 0.2], [2.8, 0], [4.2, 0]],
      eyeOpen: [[0, 1], [0.6, 1.1], [3.4, 1.08], [4.2, 1]],
      browY: [[0, 0], [0.6, 0.45], [3.4, 0.4], [4.2, 0]],
      browAngle: [[0, 0], [0.6, -0.3], [3.4, -0.3], [4.2, 0]],
      blush: [[0, 0], [1.2, 0.25], [3.4, 0.25], [4.4, 0]],
      breath: [[0, 0], [0.8, 0.8], [3.4, 0.6], [4.4, 0], [4.8, 0.2]]
    }
  },
  hum: {
    label: "Listen",
    dur: 5.6,
    idle: !0,
    tracks: {
      angleY: [[0, 0], [0.45, -5], [0.9, 2], [1.35, -5], [1.8, 2], [2.25, -5], [2.7, 2], [3.15, -5], [3.6, 2], [4.05, -4], [4.8, 0]],
      angleZ: [[0, 0], [0.9, 8], [1.8, -8], [2.7, 8], [3.6, -8], [4.6, 0]],
      angleX: [[0, 0], [0.9, 4], [1.8, -4], [2.7, 4], [3.6, -4], [4.6, 0]],
      bodyAngleZ: [[0, 0], [0.9, -3], [1.8, 3], [2.7, -3], [3.6, 3], [4.6, 0]],
      bodyAngleX: [[0, 0], [1.8, 2], [3.6, -2], [4.8, 0]],
      handAngle: [[0, 0], [0.9, 3], [1.8, -3], [2.7, 3], [3.6, -3], [4.6, 0]],
      fingerTap: [[0, 0], [0.45, 1], [0.9, 0], [1.35, 1], [1.8, 0], [2.25, 1], [2.7, 0], [3.15, 1], [3.6, 0], [5.6, 0]],
      gazeX: [[0, 0], [0.9, 0.3], [1.8, -0.3], [2.7, 0.3], [3.6, -0.3], [4.6, 0]],
      eyeOpen: [[0, 1], [0.4, 0.72], [4.6, 0.72], [5.3, 1]],
      eyeSmile: [[0, 0], [0.4, 0.55], [4.6, 0.55], [5.3, 0]],
      blush: [[0, 0], [0.8, 0.3], [4.6, 0.3], [5.6, 0]],
      browY: [[0, 0], [0.5, 0.25], [4.6, 0.25], [5.4, 0]],
      breath: [[0, 0], [0.9, 0.9], [1.8, 0.2], [2.7, 0.9], [3.6, 0.2], [4.6, 0.8], [5.6, 0]]
    }
  },
  tap: {
    label: "Tap",
    dur: 5,
    idle: !0,
    tracks: {
      gazeX: [[0, 0], [0.3, -0.6], [2.2, -0.5], [2.5, -0.1], [2.8, -0.6], [4.2, -0.5], [4.7, 0]],
      gazeY: [[0, 0], [0.3, 0.55], [4.2, 0.5], [4.7, 0]],
      angleX: [[0, 0], [0.8, -11], [2.4, -9], [3, -12], [4.2, -10], [5, 0]],
      angleY: [[0, 0], [0.8, 8], [4.2, 7], [5, 0]],
      angleZ: [[0, 0], [0.8, 6], [2.4, 4], [3, 7], [4.2, 5], [5, 0]],
      bodyAngleX: [[0, 0], [1, -2], [4.2, -2], [5, 0]],
      handAngle: [[0, 0], [0.8, 3], [4.2, 3], [5, 0]],
      fingerTap: [
        [0, 0],
        [0.9, 0],
        [1.05, 1],
        [1.2, 0],
        [1.4, 1],
        [1.55, 0],
        [1.75, 1],
        [1.9, 0],
        [2.6, 0],
        [2.75, 1],
        [2.9, 0],
        [3.1, 1],
        [3.25, 0],
        [5, 0]
      ],
      browY: [[0, 0], [0.6, 0.3], [4.2, 0.25], [5, 0]],
      browAngle: [[0, 0], [0.6, -0.35], [4.2, -0.3], [5, 0]],
      eyeOpen: [[0, 1], [0.6, 0.9], [4.2, 0.9], [5, 1]],
      breath: [[0, 0], [0.8, 0.7], [2.2, 0.4], [3.2, 0.8], [4.4, 0], [5, 0.2]]
    }
  },
  readNote: {
    label: "Read script",
    dur: 2.6,
    idle: !0,
    tracks: {
      // a quick look down at the notes on the desk and back to the camera
      gazeY: [[0, 0], [0.2, -0.85], [1.5, -0.8], [1.75, 0], [2.6, 0]],
      gazeX: [[0, 0], [0.2, -0.15], [1.5, -0.1], [1.75, 0]],
      angleY: [[0, 0], [0.45, -9], [1.5, -8], [2, 1], [2.6, 0]],
      angleZ: [[0, 0], [0.5, 2], [1.6, 2], [2.6, 0]],
      eyeOpen: [[0, 1], [0.3, 0.78], [1.5, 0.78], [1.75, 1]],
      breath: [[0, 0.3], [0.8, 0.5], [1.8, 0.2], [2.6, 0.4]]
    }
  },
  waiting: {
    label: "Fidget",
    dur: 6.4,
    idle: !0,
    tracks: {
      // shifts her weight, checks the viewer, looks away, shifts back
      bodyAngleZ: [[0, 0], [0.9, 5], [2.4, 4], [3.3, -5], [5.2, -4], [6.4, 0]],
      bodyAngleX: [[0, 0], [0.9, 3], [3.3, -3], [5.2, -2], [6.4, 0]],
      angleZ: [[0, 0], [1, -6], [2.4, -4], [3.4, 6], [5.2, 5], [6.4, 0]],
      angleX: [[0, 0], [1.2, -8], [2.2, 2], [3.6, 12], [5, 10], [6.2, 0]],
      angleY: [[0, 0], [1.2, -3], [2.2, 2], [3.6, -2], [6.2, 0]],
      armAngle: [[0, 0], [0.9, 3], [3.3, -3], [5.2, -2], [6.4, 0]],
      handAngle: [[0, 0], [1.2, 3], [3.4, -3], [6.4, 0]],
      fingerTap: [[0, 0], [4.2, 0], [4.35, 1], [4.5, 0], [4.7, 1], [4.85, 0], [6.4, 0]],
      gazeX: [[0, 0], [0.9, -0.7], [1.9, -0.6], [2.1, 0], [2.7, 0], [2.9, 0.8], [5, 0.7], [5.4, 0], [6.4, 0]],
      gazeY: [[0, 0], [0.9, -0.2], [2.1, 0], [2.9, 0.3], [5.4, 0]],
      eyeOpen: [[0, 1], [2, 1], [2.2, 1.06], [2.8, 1.05], [3.1, 0.85], [5.4, 0.85], [6.2, 1]],
      browAngle: [[0, 0], [0.9, -0.35], [2, -0.35], [2.3, 0], [3.1, -0.4], [5.4, -0.35], [6.4, 0]],
      browY: [[0, 0], [2.2, 0.4], [2.8, 0.35], [3.2, 0], [6.4, 0]],
      breath: [[0, 0.3], [0.9, 0.8], [2, 0.3], [2.6, 0.9], [3.4, 0.2], [4.4, 0.8], [5.6, 0], [6.4, 0.2]]
    }
  },
  spaceOut: {
    label: "Daydream",
    dur: 7.4,
    idle: !0,
    tracks: {
      // gaze drifts up and away, breaths get slow and long, one slow blink
      gazeX: [[0, 0], [1.4, -0.55], [4.8, -0.6], [5.6, 0.1], [7, 0]],
      gazeY: [[0, 0], [1.4, 0.6], [4.8, 0.55], [5.6, 0], [7, 0]],
      angleX: [[0, 0], [2, -9], [4.8, -10], [6, 2], [7.4, 0]],
      angleY: [[0, 0], [2, 7], [4.8, 8], [6, -2], [7.4, 0]],
      angleZ: [[0, 0], [2, 9], [4.8, 11], [6, 2], [7.4, 0]],
      bodyAngleZ: [[0, 0], [2.2, 3], [4.8, 3.5], [6.4, 0]],
      bodyAngleX: [[0, 0], [2.2, -2], [4.8, -2], [6.4, 0]],
      handAngle: [[0, 0], [2.2, 4], [4.8, 5], [6.4, 0]],
      armAngle: [[0, 0], [2.2, 2], [4.8, 2], [6.4, 0]],
      eyeOpen: [[0, 1], [1.4, 0.8], [3, 0.8], [3.35, 0.56], [3.8, 0.8], [4.8, 0.8], [5.6, 1.04], [6.4, 1]],
      browY: [[0, 0], [1.6, 0.15], [4.8, 0.15], [5.6, 0.35], [6.6, 0]],
      breath: [[0, 0], [1.6, 0.9], [3.4, 0], [5, 0.9], [6.2, 0.1], [7.4, 0]]
    }
  }
};
function is(t, e) {
  if (e <= t[0][0]) return t[0][1];
  const n = t.length - 1;
  if (e >= t[n][0]) return t[n][1];
  let s = 0;
  for (; e > t[s + 1][0]; ) s++;
  const [a, o] = t[s], [i, c] = t[s + 1], w = (p) => p <= 0 || p >= n ? 0 : (t[p + 1][1] - t[p - 1][1]) / (t[p + 1][0] - t[p - 1][0]), y = i - a, g = (e - a) / y, h = w(s) * y, m = w(s + 1) * y, f = g * g, l = f * g;
  return (2 * l - 3 * f + 1) * o + (l - 2 * f + g) * h + (-2 * l + 3 * f) * c + (l - f) * m;
}
const ot = {
  a: { open: 0.9, form: 0, label: "あ" },
  i: { open: 0.5, form: -0.85, label: "い" },
  u: { open: 0.4, form: 0.9, label: "う" },
  e: { open: 0.62, form: -0.4, label: "え" },
  o: { open: 0.75, form: 0.6, label: "お" },
  n: { open: 0, form: null, label: "ん" }
  // closes with the previous shape
}, ls = {
  a: "あかさたなはまやらわがざだばぱぁ",
  i: "いきしちにひみりぎじぢびぴぃ",
  u: "うくすつぬふむゆるぐずづぶぷぅゔ",
  e: "えけせてねへめれげぜでべぺぇ",
  o: "おこそとのほもよろをごぞどぼぽぉ"
}, fn = {};
for (const [t, e] of Object.entries(ls)) for (const n of e) fn[n] = t;
const hs = /* @__PURE__ */ new Set([..."まみむめもばびぶべぼぱぴぷぺぽ"]), us = /* @__PURE__ */ new Set([..."あいうえおぁぃぅぇぉ"]), Jt = { ゃ: "a", ゅ: "u", ょ: "o" }, cs = /* @__PURE__ */ new Set([..."、。，．,.！？!? 　…"]), ms = (t) => t.replace(/[ァ-ヶ]/g, (e) => String.fromCharCode(e.charCodeAt(0) - 96));
function ps(t, e = 0.14) {
  const n = [];
  for (const s of ms(t)) {
    const a = n[n.length - 1];
    if (Jt[s] && a) {
      a.vowel = Jt[s];
      continue;
    }
    if (s === "ー" && a) {
      a.dur += e;
      continue;
    }
    if (s === "っ") {
      n.push({ vowel: "n", dur: e * 0.8, onset: null });
      continue;
    }
    if (s === "ん") {
      n.push({ vowel: "n", dur: e, onset: null });
      continue;
    }
    if (cs.has(s)) {
      n.push({ vowel: "n", dur: e * 2.2, onset: null });
      continue;
    }
    const o = fn[s];
    o && n.push({ vowel: o, dur: e, onset: hs.has(s) ? "lips" : us.has(s) ? null : "consonant" });
  }
  return n;
}
function fs(t, e, n = 0.5) {
  if (n !== 0.5) return ds(t, e, n);
  let s = 0;
  for (const a of t) {
    if (e < s + a.dur) {
      const o = (e - s) / a.dur, i = ot[a.vowel], c = a.onset === "lips" ? 0.05 : a.onset === "consonant" ? 0.45 : 1, w = o < 0.35 ? c + (1 - c) * (o / 0.35) : 1;
      return { open: i.open * w, form: i.form, vowel: a.vowel };
    }
    s += a.dur;
  }
  return null;
}
function ds(t, e, n) {
  const s = n < 0.5 ? (0.5 - n) * 0.72 : 0;
  let a = 0, o = 0, i = null;
  for (const c of t) {
    let w = c.vowel;
    if (c.vowel === "n" ? s && c.dur <= 0.2 && i ? w = i : (o = 0, i = null) : ((!i || o >= s) && (i = c.vowel, o = 0), o += c.dur, s && (w = i)), e < a + c.dur) {
      const y = ot[w], g = c.onset === "lips" ? 0.05 : c.onset === "consonant" ? 0.45 : 1, h = n < 0.5 ? 1 - (1 - g) * n * 2 : g * (2 - n * 2), m = Math.min(c.dur * 0.35, 0.05), f = (e - a) / m;
      return { open: y.open * (f < 1 ? h + (1 - h) * f : 1), form: y.form, vowel: w };
    }
    a += c.dur;
  }
  return null;
}
const At = { ...Xt, ...zt }, Kt = { amp: 1, stiff: 1.8 }, gs = /^(angle|bodyAngle|armAngle|handAngle)/, ys = /* @__PURE__ */ new Set([
  "eyeOpen",
  "eyeOpenL",
  "eyeSmileL",
  "eyeSmile",
  "mouthOpen",
  "mouthForm",
  "blush",
  "browY",
  "browAngle"
]), ft = (t, e, n) => {
  const s = Math.min(1, Math.max(0, (n - t) / (e - t)));
  return s * s * (3 - 2 * s);
};
function Qt(t, e) {
  const n = Math.floor(t), s = t - n, a = (i) => {
    const c = Math.sin((i + e * 57.3) * 127.1) * 43758.5453;
    return c - Math.floor(c);
  }, o = s * s * (3 - 2 * s);
  return (a(n) * (1 - o) + a(n + 1) * o) * 2 - 1;
}
const Ue = (t, e) => Qt(t, e) * 0.7 + Qt(t * 2.3, e + 9) * 0.3, Ee = (t, e, n) => Math.max(e, Math.min(n, t)), dn = {
  normal: { label: "Neutral", p: {} },
  smile: { label: "Smile", p: { eyeOpen: 0, eyeSmile: 1, blush: 0.35, browY: 0.2 } },
  shy: { label: "Blush", p: { eyeOpen: 0.78, eyeSmile: 0.5, blush: 1, browAngle: -0.5, browY: -0.1, glance: [0.7, 0.35] } },
  jito: { label: "Half-lidded", p: { eyeOpen: 0.5, browY: -0.5, browAngle: 0.6 } },
  surprise: { label: "Surprise", p: { eyeOpen: 1.22, browY: 1, mouthOpen: 0.6, mouthForm: 0.6 } },
  wink: { label: "Wink", p: { eyeOpenL: 0, eyeSmileL: 1, blush: 0.3 } },
  // talking faces for AITuber OnAir emotion tags: eyes stay mostly open (closed / ^^ eyes are
  // what a single image fakes worst, and they would stay shut for a whole sentence)
  happyTalk: { label: "happy", p: { eyeOpen: 0.8, eyeSmile: 0.45, blush: 0.35, browY: 0.25, mouthForm: -0.5 } },
  sadTalk: { label: "sad", p: { eyeOpen: 0.78, browAngle: -0.8, browY: -0.2, mouthForm: 0.3, glance: [0, -0.35] } },
  angryTalk: { label: "angry", p: { eyeOpen: 0.72, browAngle: 0.85, browY: -0.55, mouthForm: 0.2 } },
  surprisedTalk: { label: "surprised", p: { eyeOpen: 1.18, browY: 0.9, mouthForm: 0.9 } },
  relaxedTalk: { label: "relaxed", p: { eyeOpen: 0.82, eyeSmile: 0.35, blush: 0.15, browY: 0.1 } }
}, en = {
  happy: ["happyTalk", "nod"],
  sad: ["sadTalk", "sigh"],
  angry: ["angryTalk", "no"],
  surprised: ["surprisedTalk", "surprise"],
  relaxed: ["relaxedTalk", "sway"],
  neutral: ["normal", null]
}, bs = {
  gazeX: [260, 0.9],
  gazeY: [260, 0.9],
  angleX: [55, 0.72],
  angleY: [55, 0.72],
  angleZ: [45, 0.75],
  bodyAngleX: [14, 0.9],
  bodyAngleZ: [12, 0.9],
  weightShift: [14, 0.9],
  armAngle: [20, 0.85],
  handAngle: [30, 0.8]
};
function vs(t) {
  const e = (t + 0.45) % 5, n = e < 2.5 ? -0.7 : 0.7, s = -n, a = e % 2.5;
  if (a >= 0.9) return s;
  const o = a / 0.9, i = o * o * o * (10 + o * (-15 + 6 * o));
  return n + (s - n) * i;
}
class ws {
  /** @param {number[]} gazeCenter @param {boolean} [planted] @param {import('../rig/types').Rig|null} [armRig] */
  constructor(e, n = !1, s = null) {
    this.armRig = s, this.armFollow = 0, this.armVelocity = 0, this.planted = n, this.mode = "auto", this.P = Object.fromEntries(mt.map((a) => [a.id, a.def])), this.manual = { ...this.P }, this.cur = { ...this.P }, this.vel = Object.fromEntries(mt.map((a) => [a.id, 0])), this.expr = "normal", this.exprMix = {}, this.t = 0, this.blink = { t: 0, start: 1.5, double: !1 }, this.gaze = { x: 0, y: 0, next: 0 }, this.tap = { next: 4, until: -1 }, this.pointer = null, this.faceCenter = [...e], this.lipOpen = null, this.lipForm = 0, this.speaking = !1, this.voice = 0, this.mouth = 0, this.vowel = "a", this.vowelForm = 0, this.lipSync = Ht(), this.lipMotion = qt(this.lipSync), this.syllableArmed = !0, this.voicePeak = 0, this.voiceTrough = 0, this.kana = null, this.lipHold = null, this.emotionUntil = 0, this.talkGain = 1, this.play = null, this.autoMotion = !0, this.nextAuto = 14, this.autoIdle = !0, this.nextIdle = 3, this.lastAuto = null, this.onMotion = null;
  }
  setExpression(e) {
    this.expr = e;
  }
  hasMotion(e) {
    return e in At;
  }
  // ---- speech (driven from outside, e.g. by the TTS audio analyser) ----
  setVoiceLevel(e) {
    this.voice = Math.min(1, Math.max(0, Number(e) || 0));
  }
  setLipSync(e) {
    this.lipSync = Ht(e, this.lipSync), this.lipMotion = qt(this.lipSync);
  }
  setSpeaking(e) {
    e !== this.speaking && (this.speaking = !!e, e || (this.emotionUntil = this.t + 1.2, this.voice = 0));
  }
  /** `playMotion: false` changes only the face (a caller that picks motions itself). */
  setEmotion(e, { playMotion: n = !0 } = {}) {
    const s = en[e] ?? en.neutral;
    this.expr = s[0], this.emotionUntil = 1 / 0, s[1] && n && this.playMotion(s[1]);
  }
  /** Mouth shapes from kana text, without audio (preview / tuning). */
  /** @param {string} text @param {{ speed?: number, loop?: boolean }} [options] */
  speakKana(e, { speed: n, loop: s = !1 } = {}) {
    this.lipHold = null;
    const a = ps(e, n === void 0 ? 0.14 : 1 / Ee(Number(n) || 7, 4, 12));
    this.kana = a.length ? { moras: a, t: 0, loop: s, duration: a.reduce((o, i) => o + i.dur, 0) } : null;
  }
  holdMouth(e) {
    this.kana = null, this.lipHold = Object.hasOwn(ot, e) ? e : null;
  }
  stopLipSync() {
    this.kana = null, this.lipHold = null, this.lipOpen = null, this.mouth = 0;
  }
  getLipSyncState() {
    return { active: this.kana !== null || this.lipHold !== null, open: this.P.mouthOpen, form: this.P.mouthForm };
  }
  // Mouth from the TTS loudness. A volume signal has no vowel information, so each syllable
  // (the voice dipping and rising again) gets one vowel at random, weighted towards a, and
  // keeps it until the next syllable: the drawn mouths must not change shape mid-syllable.
  // Syllables are found relative to the recent peak (not an absolute level), and the mouth
  // is scaled by where the voice sits between the recent trough and peak, so it closes in
  // the dip before each mora even when a loud voice never gets quiet.
  speechMouth(e) {
    if (this.kana || this.lipHold) {
      let m;
      if (this.lipHold ? m = ot[this.lipHold] : (this.kana.t += e, this.kana.loop && (this.kana.t %= this.kana.duration), m = fs(this.kana.moras, this.kana.t, this.lipSync.granularity)), !m)
        return this.kana = null, this.mouth > 0.01 ? [this.mouth *= this.lipSync.closeSpeed === 0.5 ? 0.6 : Math.exp(-e * this.lipMotion.kanaRelease), this.vowelForm] : null;
      const f = this.lipMotion.openness === 1 ? m.open : Math.min(1, m.open * this.lipMotion.openness), l = f > this.mouth ? 1 - Math.exp(-e * 30) : 1 - Math.exp(-e * this.lipMotion.kanaRelease);
      return this.mouth += (f - this.mouth) * l, m.form !== null && (this.vowelForm = m.form), [this.mouth, this.vowelForm];
    }
    const n = this.speaking ? this.voice : 0, s = 1 - Math.exp(-e * this.lipMotion.relax);
    this.voicePeak = n > this.voicePeak ? n : this.voicePeak + (n - this.voicePeak) * s, this.voiceTrough = n < this.voiceTrough ? n : this.voiceTrough + (n - this.voiceTrough) * s;
    const a = Math.max(this.voicePeak, 0.05);
    if (n < a * this.lipMotion.arm) this.syllableArmed = !0;
    else if (this.syllableArmed && n > a * this.lipMotion.trigger && n > 0.1) {
      this.syllableArmed = !1;
      const m = Math.random();
      this.vowel = m < 0.4 ? "a" : m < 0.58 ? "o" : m < 0.74 ? "e" : m < 0.88 ? "i" : "u";
    }
    const o = this.voicePeak - this.voiceTrough, i = o < a * this.lipMotion.range ? 1 : Math.max(0, (n - this.voiceTrough) / o), c = ot[this.vowel ?? "a"], w = Math.min(1, Math.pow(n, 0.7) * 1.15) * Math.pow(i, this.lipMotion.risePower), y = this.speaking ? Math.min(0.95, w) * (0.45 + 0.55 * c.open / 0.9) : 0, g = this.lipMotion.openness === 1 ? y : Math.min(1, y * this.lipMotion.openness), h = g > this.mouth ? 1 - Math.exp(-e * 40) : 1 - Math.exp(-e * this.lipMotion.audioRelease);
    return this.mouth += (g - this.mouth) * h, this.speaking && (this.vowelForm = c.form), this.speaking || this.mouth > 0.01 ? [this.mouth, this.vowelForm] : null;
  }
  // Breathing: inhale ~40% of the cycle, a slower exhale, a short pause at the bottom,
  // and a period that drifts between ~3.2 and 4.6 s so it never looks metronomic.
  breathValue(e) {
    this.breathPhase = (this.breathPhase ?? 0) + e / (this.breathPeriod ?? 3.8), this.breathPhase >= 1 && (this.breathPhase -= 1, this.breathPeriod = 3.2 + Math.random() * 1.4);
    const n = this.breathPhase;
    return n < 0.4 ? ft(0, 0.4, n) : n < 0.88 ? 1 - ft(0.4, 0.88, n) : 0;
  }
  // pick one at random, never the one that just played
  playRandom(e) {
    const n = e.filter((s) => s !== this.lastAuto);
    this.playMotion(n[Math.floor(Math.random() * n.length)]);
  }
  playMotion(e) {
    this.lastAuto = e, this.play = { id: e, t: 0 }, this.onMotion?.(e);
  }
  blinkValue(e) {
    const n = this.blink;
    if (n.t += e, n.t < n.start) return 1;
    const s = (n.t - n.start) / 0.17;
    return s >= 1 ? (n.double ? (n.double = !1, n.start = n.t + 0.07) : (n.start = n.t + 1.8 + Math.random() * 4.2, n.double = Math.random() < 0.18), 1) : s < 0.45 ? 1 - s / 0.45 : (s - 0.45) / 0.55;
  }
  update(e) {
    this.t += e;
    const n = this.t, s = {};
    for (const l of mt) s[l.id] = l.def;
    if (this.mode === "manual")
      Object.assign(s, this.manual);
    else if (this.mode === "auto") {
      if (s.angleX = Ue(n * 0.18, 1) * 10 + this.gaze.x * 11, s.angleY = Ue(n * 0.15, 2) * 6 - 1 + this.gaze.y * 7, s.angleZ = Ue(n * 0.12, 3) * 10, s.bodyAngleX = Ue(n * 0.1, 4) * 5 * (this.planted ? 0.35 : 1), s.bodyAngleZ = Ue(n * 0.09, 5) * 4 * (this.planted ? 0.35 : 1), s.weightShift = this.planted ? vs(n) : 0.7 * Math.sin(n * Math.PI * 2 / 5), s.armAngle = Ue(n * 0.14, 6) * 5, s.handAngle = Ue(n * 0.21, 7) * 5, n > this.gaze.next) {
        const l = Math.random();
        this.gaze.x = l < 0.45 ? 0 : (Math.random() * 2 - 1) * 0.8, this.gaze.y = l < 0.45 ? 0 : (Math.random() * 2 - 1) * 0.5, this.gaze.next = n + 0.8 + Math.random() * 2.5;
      }
      if (s.gazeX = this.gaze.x + s.angleX / 60, s.gazeY = this.gaze.y + s.angleY / 60, n > this.tap.next && (this.tap.until = n + 1.1, this.tap.next = n + 5 + Math.random() * 6), this.speaking) {
        this.nextIdle = Math.max(this.nextIdle, n + 2.5), this.nextAuto = Math.max(this.nextAuto, n + 6);
        const l = this.talkGain;
        this.talkNod = (this.talkNod ?? 0) + (this.voice * 7 * l - (this.talkNod ?? 0)) * Math.min(1, e * 6), s.angleY -= this.talkNod, s.angleX += Ue(n * 0.6, 11) * 5 * l, s.angleZ += Ue(n * 0.5, 12) * 4 * l;
      }
      !this.speaking && n > this.emotionUntil && (this.expr = "normal", this.emotionUntil = 1 / 0), this.speaking || (!this.play && this.autoMotion && n > this.nextAuto ? (this.playRandom(Object.keys(Xt).filter((l) => l !== "surprise")), this.nextAuto = n + 15 + Math.random() * 10, this.nextIdle = Math.max(this.nextIdle, n + 5)) : !this.play && this.autoIdle && n > this.nextIdle && (this.playRandom(Object.keys(zt)), this.nextIdle = n + 5 + Math.random() * 5));
    } else if (this.mode === "mouse" && this.pointer) {
      const l = (this.pointer[0] - this.faceCenter[0]) / 500, p = (this.pointer[1] - this.faceCenter[1]) / 500;
      s.angleX = Ee(l * 30, -30, 30), s.angleY = Ee(-p * 30, -30, 30), s.angleZ = Ee(-l * p * 25, -12, 12), s.bodyAngleX = Ee(l * 10, -10, 10) * 0.6, s.gazeX = Ee(l * 1.4, -1, 1), s.gazeY = Ee(-p * 1.4, -1, 1), s.handAngle = Ee(l * 4, -5, 5);
    }
    this.mode !== "manual" && (s.breath = this.breathValue(e), n < this.tap.until && (s.fingerTap = Math.max(0, Math.sin((this.tap.until - n) * Math.PI * 3.6)) ** 2));
    let a = null, o = 0;
    if (this.play) {
      const l = At[this.play.id];
      if (this.play.t += e, this.play.t >= l.dur)
        this.play = null, this.onMotion?.(null);
      else {
        a = {};
        for (const [p, u] of Object.entries(l.tracks))
          a[p] = is(u, this.play.t) * (l.idle && gs.test(p) ? Kt.amp : 1);
        o = ft(0, 0.15, this.play.t) * (1 - ft(l.dur - 0.25, l.dur, this.play.t));
        for (const [p, u] of Object.entries(a))
          os.has(p) ? s[p] += u : p === "breath" ? s[p] += (u - s[p]) * o : ys.has(p) || (s[p] = Math.max(s[p], Math.max(0, u)));
      }
    }
    if (this.mode !== "manual" && (s.angleY += s.breath * 1.6), this.armRig?.arms && this.mode !== "manual") {
      const { arms: l, body: p, legs: u } = this.armRig, v = -s.bodyAngleZ / 10 * p.maxRoll + (u ? u.tilt * (1 - (u.spine ?? 0.7)) * s.weightShift : 0), r = Ee(e, 0, 0.05), d = Math.ceil(r * 240);
      for (let A = 0; A < d; A++) {
        const F = r / d;
        this.armVelocity += (100 * (-v * 0.65 - this.armFollow) - 18 * this.armVelocity) * F, this.armFollow += this.armVelocity * F;
      }
      const x = (l.swing ?? rt.swing) * Math.PI / 180, b = l.inward ?? rt.inward;
      for (const [A, F] of [["L", 1], ["R", -1]]) {
        const U = F * this.armFollow, ne = x * (U < 0 ? b : 1);
        s[`armSwing${A}`] = Ee((ne > 0 ? U / ne : 0) + (s.breath - 0.5) * 0.06, -1, 1), s[`elbowBend${A}`] = s.breath * 0.025;
      }
    }
    const i = dn[this.expr].p, c = ["eyeOpen", "eyeOpenL", "eyeSmileL", "eyeSmile", "mouthOpen", "mouthForm", "blush", "browY", "browAngle", "gx", "gy"], w = {
      eyeOpen: i.eyeOpen ?? 1,
      eyeOpenL: i.eyeOpenL ?? i.eyeOpen ?? 1,
      eyeSmileL: i.eyeSmileL ?? i.eyeSmile ?? 0,
      eyeSmile: i.eyeSmile ?? 0,
      mouthOpen: i.mouthOpen ?? 0,
      mouthForm: i.mouthForm ?? 0,
      blush: i.blush ?? 0,
      browY: i.browY ?? 0,
      browAngle: i.browAngle ?? 0,
      gx: i.glance?.[0] ?? 0,
      gy: i.glance?.[1] ?? 0
    }, y = 1 - Math.exp(-e * 9);
    for (const l of c)
      this.exprMix[l] === void 0 && (this.exprMix[l] = w[l]), this.exprMix[l] += (w[l] - this.exprMix[l]) * y;
    const g = this.exprMix, h = {};
    for (const l of mt) {
      const p = l.id;
      if (this.mode === "manual" && !a) {
        h[p] = s[p], this.cur[p] = s[p], this.vel[p] = 0;
        continue;
      }
      let [u, v] = bs[p] ?? [120, 0.95];
      a && /^angle|^body/.test(p) && (At[this.play?.id ?? ""]?.idle ? (u *= Kt.stiff, v = 0.8) : /^angle/.test(p) && (u *= 4.5, v = 0.75));
      const r = 2 * Math.sqrt(u) * v;
      this.vel[p] += (u * (s[p] - this.cur[p]) - r * this.vel[p]) * e, this.cur[p] += this.vel[p] * e, h[p] = this.cur[p];
    }
    let m = 1;
    if (this.mode !== "manual" ? (m = this.blinkValue(e), h.eyeROpen = g.eyeOpen * m, h.eyeLOpen = g.eyeOpenL * m, h.eyeSmile = g.eyeSmile, h.eyeSmileL = g.eyeSmileL, h.mouthOpen = g.mouthOpen, h.mouthForm = g.mouthForm, h.blush = g.blush, h.browY = g.browY + (h.angleY > 0 ? h.angleY / 60 : 0) - (1 - m) * 0.18, h.browAngle = g.browAngle, h.gazeX = Ee(h.gazeX + g.gx, -1, 1), h.gazeY = Ee(h.gazeY + g.gy, -1, 1)) : h.eyeSmileL = h.eyeSmile, a) {
      const l = (u, v) => {
        h[u] += (v - h[u]) * o;
      }, p = (u) => Math.min(1.3, Math.max(0, u));
      "eyeOpen" in a && (l("eyeROpen", p(a.eyeOpen) * m), "eyeOpenL" in a || l("eyeLOpen", p(a.eyeOpen) * m)), "eyeOpenL" in a && l("eyeLOpen", p(a.eyeOpenL) * m), "eyeSmile" in a && (l("eyeSmile", a.eyeSmile), "eyeSmileL" in a || l("eyeSmileL", a.eyeSmile)), "eyeSmileL" in a && l("eyeSmileL", a.eyeSmileL);
      for (const u of ["mouthOpen", "mouthForm", "blush", "browY", "browAngle"])
        u in a && l(u, u === "mouthOpen" || u === "blush" ? Math.max(0, a[u]) : a[u]);
    }
    const f = this.speechMouth(e);
    return f ? (this.lipOpen = f[0], this.lipForm = f[1]) : this.lipOpen !== null && !this.speaking && !this.kana && (this.lipOpen = null), this.lipOpen !== null && (h.mouthOpen = Math.max(h.mouthOpen * 0.3, this.lipOpen), h.mouthForm = Ee(this.lipForm, -1, 1)), this.P = h, h;
  }
}
const bt = {
  neutral: "normal",
  smile: "smile",
  shy: "shy",
  surprise: "surprise",
  halfLidded: "jito",
  angry: "angryTalk",
  sad: "sadTalk",
  wink: "wink"
}, xs = { sad: { pitch: -6, gy: -0.45 } }, nt = (t, e, n) => Math.max(e, Math.min(n, t)), st = Object.freeze({ eyeOpen: 1, eyeOpenL: 1, eyeSmile: 0, eyeSmileL: 0, blush: 0, browY: 0, browAngle: 0, mouthOpen: 0, mouthForm: 0, gx: 0, gy: 0, pitch: 0 });
function Ms(t, e = {}) {
  const n = dn[bt[t]]?.p ?? {}, s = xs[t] ?? {}, a = t === "neutral" ? void 0 : e[t]?.mouthOpen;
  return {
    eyeOpen: n.eyeOpen ?? 1,
    eyeOpenL: n.eyeOpenL ?? n.eyeOpen ?? 1,
    eyeSmile: n.eyeSmile ?? 0,
    eyeSmileL: n.eyeSmileL ?? n.eyeSmile ?? 0,
    blush: n.blush ?? 0,
    browY: n.browY ?? 0,
    browAngle: n.browAngle ?? 0,
    mouthOpen: a ?? n.mouthOpen ?? 0,
    mouthForm: n.mouthForm ?? 0,
    gx: n.glance?.[0] ?? 0,
    gy: s.gy ?? n.glance?.[1] ?? 0,
    pitch: s.pitch ?? 0
  };
}
function As(t, e) {
  const n = { ...t };
  return n.eyeROpen = (t.eyeROpen ?? 1) * e.eyeOpen, n.eyeLOpen = (t.eyeLOpen ?? 1) * e.eyeOpenL, n.eyeSmile = Math.max(t.eyeSmile ?? 0, e.eyeSmile), n.eyeSmileL = Math.max(t.eyeSmileL ?? t.eyeSmile ?? 0, e.eyeSmileL), n.blush = Math.max(t.blush ?? 0, e.blush), n.browY = nt((t.browY ?? 0) + e.browY, -1, 1), n.browAngle = nt((t.browAngle ?? 0) + e.browAngle, -1, 1), n.mouthOpen = Math.max(t.mouthOpen ?? 0, e.mouthOpen), e.mouthOpen > (t.mouthOpen ?? 0) && (n.mouthForm = e.mouthForm), n.gazeX = nt((t.gazeX ?? 0) + e.gx, -1, 1), n.gazeY = nt((t.gazeY ?? 0) + e.gy, -1, 1), n.angleY = nt((t.angleY ?? 0) + e.pitch, -30, 30), n;
}
class Es {
  /** @type {keyof typeof OVERLAY_EXPRESSIONS} */
  name = "neutral";
  mix = { ...st };
  /** @param {Record<string, { mouthOpen?: number }>} [settings] parsed per-expression settings */
  constructor(e = {}) {
    this.settings = e;
  }
  /** @param {string} name */
  set(e) {
    this.name = Object.hasOwn(bt, e) ? (
      /** @type {keyof typeof OVERLAY_EXPRESSIONS} */
      e
    ) : "neutral";
  }
  /** True while an expression is shown or still fading out. */
  get active() {
    return this.name !== "neutral" || Object.keys(st).some((e) => Math.abs(this.mix[e] - st[e]) > 1e-3);
  }
  apply(e, n) {
    if (!this.active)
      return this.mix = { ...st }, e;
    const s = Ms(this.name, this.settings), a = 1 - Math.exp(-Math.max(0, n) * 12);
    for (const o of Object.keys(st)) this.mix[o] += (s[o] - this.mix[o]) * a;
    return As(e, this.mix);
  }
}
const tn = (t) => !!t && typeof t == "object" && !Array.isArray(t);
function Pt(t) {
  if (!tn(t)) throw new TypeError("expressions: expected an object");
  const e = {};
  for (const [n, s] of Object.entries(t)) {
    if (n === "neutral" || !Object.hasOwn(bt, n)) continue;
    if (!tn(s)) throw new TypeError(`expressions.${n}: expected an object`);
    const a = {}, o = s.mouthOpen;
    if (o !== void 0) {
      if (typeof o != "number" || !Number.isFinite(o) || o < 0 || o > 1)
        throw new RangeError(`expressions.${n}.mouthOpen: expected 0–1`);
      a.mouthOpen = o;
    }
    e[n] = a;
  }
  return e;
}
function Ts(t = {}, e = {}) {
  const n = {};
  for (const s of /* @__PURE__ */ new Set([...Object.keys(t), ...Object.keys(e)]))
    n[s] = { ...t[s], ...e[s] };
  return n;
}
const nn = ["ball", "low", "crease", "lash"], Et = /* @__PURE__ */ new Map(), Tt = /* @__PURE__ */ new Map();
async function St(t) {
  return Tt.has(t) || Tt.set(t, fetch(t).then((e) => {
    if (!e.ok) throw new Error(`failed to load ${t}`);
    return e.json();
  })), Tt.get(t);
}
function Lt(t) {
  if (Et.has(t)) return Et.get(t);
  const e = new Promise((n, s) => {
    const a = new Image();
    a.onload = () => n(a), a.onerror = () => s(new Error(`failed to load ${t}`)), a.src = t;
  });
  return Et.set(t, e), e;
}
function gn(t, e) {
  const n = document.createElement("canvas");
  n.width = t.width, n.height = t.height;
  const s = n.getContext("2d");
  s.drawImage(t, 0, 0);
  const a = s.getImageData(0, 0, n.width, n.height).data, o = new Uint8Array(n.width * n.height);
  for (let i = 0; i < o.length; i++) o[i] = a[i * 4 + e];
  return o;
}
const Ie = (t) => gn(t, 3);
function Ss(t, [e, n, s, a]) {
  const o = document.createElement("canvas");
  return o.width = s, o.height = a, o.getContext("2d").drawImage(t, e, n, s, a, 0, 0, s, a), o;
}
function Ls(t, e) {
  const [n, s] = t.t.pivot, a = t.dir, o = t.pts, i = (f, l, p) => {
    const u = Math.min(1, Math.max(0, (p - f) / (l - f)));
    return u * u * (3 - 2 * u);
  }, c = Math.cos(t.phi[0]), w = Math.sin(t.phi[0]), y = Math.cos(t.phi[1]), g = Math.sin(t.phi[1]), h = e.rest, m = e.pos;
  for (let f = 0; f < h.length; f += 2) {
    const l = h[f] - n, p = h[f + 1] - s, u = l * a[0] + p * a[1], v = o[0][0] + l * c - p * w, r = o[0][1] + l * w + p * c, d = l - a[0] * t.L1, x = p - a[1] * t.L1, b = o[1][0] + d * y - x * g, A = o[1][1] + d * g + x * y, F = i(t.L1 * 0.55, t.L1 * 1.35, u);
    m[f] = v + (b - v) * F, m[f + 1] = r + (A - r) * F;
  }
}
async function ks(t, e) {
  if (!e.assets && e.assetsBase === void 0)
    throw new Error("createMeshAvatar requires assets or assetsBase.");
  const n = e.rig, s = $n(n), {
    IMG: a,
    EYES: o,
    baseWeights: i,
    deformBase: c,
    eyePartY: w,
    eyePartAlpha: y,
    handWeights: g,
    handFrame: h,
    deformHand: m,
    TASSELS: f
  } = s, { Renderer: l, buildGrid: p } = Vn(s, n), { Physics: u } = Hn(s, n), { Cloth: v } = ts(s, n), r = n.cloth ?? [], { createSprites: d } = ns(s, n), x = (e.assetsBase ?? "").replace(/\/?$/, "/"), b = (E, k) => {
    if (e.assets) {
      if (!e.assets[E]) throw new Error(`Missing project asset: ${E}`);
      return e.assets[E];
    }
    return `${x}${E}${k === void 0 ? "" : `?b=${k}`}`;
  }, A = await St(b("layers.json")), F = [r.length ? "base_cloth" : "base", ...n.hand ? ["hand"] : [], ...f.map((E) => E.name), ...r.map((E) => `cloth_${E.name}`), ...[0, 1].flatMap((E) => nn.map((k) => `eye${E}_${k}`)), "hairmask"], U = Object.fromEntries(await Promise.all(F.map(async (E) => [E, await Lt(b(`${E}.png`, A.build))])));
  r.length && (U.base = U.base_cloth);
  const ne = gn(U.hairmask, 0), X = (E, k) => ne[Math.min(a.h - 1, Math.max(0, Math.round(k))) * a.w + Math.min(a.w - 1, Math.max(0, Math.round(E)))] / 255, G = new l(t, { padTop: e.padTop ?? n.view.padTop, padSide: e.padSide ?? n.view.padSide, fit: e.fit }), R = { base: [0, 0, a.w, a.h], ...A.layers }, I = new v(), B = (E) => {
    const k = `cloth_${E.name}`, C = p(R[k], n.mesh.clothCell ?? 8, Ie(U[k]), U[k].width);
    I.attach(E.name, C), G.addLayer(k, U[k], C);
  };
  r.filter((E) => E.behind).forEach(B);
  const j = p(R.base, n.mesh.baseCell, Ie(U.base), U.base.width, n.mesh.fine), Y = [];
  for (let E = 0; E < j.rest.length / 2; E++) {
    const k = j.rest[E * 2], C = j.rest[E * 2 + 1];
    Y.push(i(k, C, X(k, C)));
  }
  G.addLayer("base", U.base, j, { face: !0 });
  const P = [];
  o.forEach((E, k) => {
    for (const C of nn) {
      const V = `eye${k}_${C}`, Q = p(R[V], C === "ball" ? n.mesh.eyeBallCell : n.mesh.eyeCell, Ie(U[V]), U[V].width), ie = [];
      for (let ge = 0; ge < Q.rest.length / 2; ge++) ie.push(i(Q.rest[ge * 2], Q.rest[ge * 2 + 1], 0));
      const ce = G.addLayer(V, U[V], Q, { eyeBall: C === "ball" ? k : void 0 });
      P.push({ e: E, eye: k, part: C, mesh: Q, W: ie, layer: ce });
    }
  });
  let N = null;
  try {
    {
      const E = await St(b("sprites/sprites.json")), k = Object.fromEntries(await Promise.all(Object.keys(E.layers).map(async (C) => [C, await Lt(b(`sprites/${C}.png`, E.build))])));
      N = d(G, E, k, p, Ie);
    }
  } catch (E) {
    console.warn("eye / mouth sprites not loaded:", E);
  }
  r.filter((E) => !E.behind).forEach(B);
  let q = null;
  try {
    const E = await St(b("overlays/overlays.json")), k = Object.fromEntries(await Promise.all(E.overlays.map(async (C) => [C.name, await Lt(b(`overlays/${C.file}`))])));
    q = rs(G, E, k, p, Ie, i, n.mesh.spriteCell, a.w, a.h, Ss);
  } catch (E) {
    e.assets?.["overlays/overlays.json"] && console.warn("overlay layers not loaded:", E);
  }
  const ae = f.map((E) => {
    const k = p(R[E.name], n.mesh.tasselCell, Ie(U[E.name]), U[E.name].width);
    return G.addLayer(E.name, U[E.name], k);
  }), J = n.hand ? p(R.hand, n.mesh.handCell, Ie(U.hand), U.hand.width) : { rest: [], pos: [] }, $ = [];
  for (let E = 0; E < J.rest.length / 2; E++) $.push(g(J.rest[E * 2], J.rest[E * 2 + 1]));
  n.hand && G.addLayer("hand", U.hand, J);
  const ee = new u(), Z = new ws(n.view.gazeCenter ?? [n.head.cx, n.head.cy], !!n.legs, n.arms ? n : null);
  e.lipSync !== void 0 && Z.setLipSync(e.lipSync);
  const se = /* @__PURE__ */ new Set();
  Z.onMotion = (E) => {
    for (const k of se) k(E);
  };
  let re = {}, te = 1, oe = {}, z = {};
  const M = new Es(e.expressions === void 0 ? void 0 : Pt(e.expressions));
  let T = !0;
  const S = [0, 0];
  function L(E) {
    const k = { ...Z.update(E) };
    for (const [Q, ie] of Object.entries(re)) {
      const ce = te * (oe[Q] ?? 1);
      k[Q] = ce === 1 ? ie : (k[Q] ?? 0) + (ie - (k[Q] ?? 0)) * ce;
    }
    Z.lipOpen !== null && (k.mouthOpen = Z.P.mouthOpen, (!e.preserveMouthForm || re.mouthForm === void 0) && (k.mouthForm = Z.P.mouthForm));
    const C = M.apply(k, E), V = T ? C : k;
    return z = V, V;
  }
  function _(E) {
    const k = L(E), C = ee.step(k, E), V = j.pos, Q = j.rest;
    for (let K = 0; K < Y.length; K++)
      c(Q[K * 2], Q[K * 2 + 1], Y[K], k, C, S), V[K * 2] = S[0], V[K * 2 + 1] = S[1];
    const ie = (K, le) => N?.eyesDrawn[le] ? 1 : K;
    for (const K of P) {
      const le = ie(K.eye === 0 ? k.eyeROpen : k.eyeLOpen, K.eye), de = K.eye === 0 ? k.eyeSmile : k.eyeSmileL ?? k.eyeSmile;
      K.layer.alpha = y(K.part, le, de);
      const me = K.mesh.rest, xe = K.mesh.pos;
      for (let be = 0; be < K.W.length; be++) {
        const Me = me[be * 2], Le = me[be * 2 + 1];
        c(Me, w(K.e, K.part, Me, Le, le, de), K.W[be], k, C, S), xe[be * 2] = S[0], xe[be * 2 + 1] = S[1];
      }
    }
    const ce = N?.update(k, C, E, ss(M.name, Z.mode === "manual" ? null : Z.expr));
    if (ce) for (const K of P) ce.eyes[K.eye] && (K.layer.alpha = 0);
    q?.update(k, C, c, S);
    const ge = J.pos, _e = J.rest, je = h(k);
    for (let K = 0; K < $.length; K++)
      m(_e[K * 2], _e[K * 2 + 1], $[K], k, je, S), ge[K * 2] = S[0], ge[K * 2 + 1] = S[1];
    ee.chains.forEach((K, le) => Ls(K, ae[le].mesh)), r.length && (I.step(k, E, C), I.deform());
    const ye = n.view.irisTravel ?? 7;
    G.draw({
      angleX: k.angleX,
      angleY: k.angleY,
      angleZ: k.angleZ,
      eyes: [
        ie(k.eyeROpen, 0),
        k.eyeSmile,
        k.gazeX * ye,
        -k.gazeY * ye * 0.6,
        ie(k.eyeLOpen, 1),
        k.eyeSmileL ?? k.eyeSmile,
        k.gazeX * ye * 0.85,
        -k.gazeY * ye * 0.6
      ],
      // with sprites the drawn mouths replace the shader-painted one
      mouthOpen: ce?.mouthDrawn ? 0 : k.mouthOpen,
      mouthForm: k.mouthForm,
      cheek: k.blush,
      showMesh: !1,
      originalAlpha: 0,
      joints: []
    });
  }
  let D = 0, O = performance.now(), W = !1;
  const H = (E) => {
    const k = Math.min(0.05, (E - O) / 1e3);
    O = E, _(k), D = requestAnimationFrame(H);
  };
  return e.manual || (D = requestAnimationFrame(H)), {
    motions: [
      ...Object.entries(Xt).map(([E, k]) => ({ id: E, label: k.label, idle: !1 })),
      ...Object.entries(zt).map(([E, k]) => ({ id: E, label: k.label, idle: !0 }))
    ],
    setParameters(E, k = 1, C = {}) {
      re = { ...E }, te = Math.min(1, Math.max(0, Number(k) || 0)), oe = Object.fromEntries(Object.entries(C ?? {}).map(([V, Q]) => [V, Math.min(1, Math.max(0, Number(Q) || 0))]));
    },
    getParameters() {
      return { ...z };
    },
    /** 0..1 loudness of the voice being played (e.g. normalised RMS). */
    setVoiceLevel(E) {
      Z.setVoiceLevel(E);
    },
    /** Partial mouth-movement settings; omitted fields retain their current values. */
    setLipSync(E) {
      Z.setLipSync(E);
    },
    /** true while TTS audio is playing: idle motions pause and the head nods along. */
    setSpeaking(E) {
      Z.setSpeaking(E);
    },
    /** AITuber OnAir emotion tag: happy / sad / angry / surprised / relaxed / neutral (or null). */
    setEmotion(E, k) {
      Z.setEmotion(E, k);
    },
    /** Live expression layered over tracking (see OVERLAY_EXPRESSIONS); 'neutral' clears it. */
    // parameters:false selects drawn expression sprites without changing numeric parameters.
    setExpression(E, { parameters: k = !0 } = {}) {
      M.set(E), T = k;
    },
    /** Show the named overlay layers (built/overlays/overlays.json) and hide the others. */
    setOverlays(E) {
      q?.set(E);
    },
    getExpression() {
      return { name: M.name, active: M.active };
    },
    /** How much the head moves with the voice while speaking (1 = default, calmer below). */
    setTalkGain(E) {
      Z.talkGain = Math.max(0, Number(E) || 0);
    },
    /** Play a motion or idle motion by id (see `motions`). */
    play(E) {
      Z.hasMotion(E) && Z.playMotion(E);
    },
    /** Move the mouth through the vowels of kana text (no audio; for previews). */
    speakKana(E, k) {
      Z.speakKana(String(E ?? ""), k);
    },
    holdMouth(E) {
      Z.holdMouth(E);
    },
    stopLipSync() {
      Z.stopLipSync();
    },
    getLipSyncState() {
      return Z.getLipSyncState();
    },
    setAutoIdle(E) {
      Z.autoIdle = !!E;
    },
    setLighting(E) {
      G.setLighting(E);
    },
    getLightingStats() {
      return { ...G.lightingStats };
    },
    setAutoMotion(E) {
      Z.autoMotion = !!E;
    },
    /** Hair / tassel sway multiplier (1 = default). */
    setSwayGain(E) {
      ee.gain = E, I.gain = E;
    },
    setClothTuning(E, k) {
      I.setTuning(E, k);
    },
    /** Called with the motion id when a motion starts and with null when it ends. */
    onMotion(E) {
      return se.add(E), () => se.delete(E);
    },
    /** Advance the simulation by `sec` and draw (for tests / hidden tabs). */
    advance(E, k = 60) {
      if (!W)
        if (E === 0) _(0);
        else for (let C = 0; C < Math.round(E * k); C++) _(1 / k);
    },
    /** Update motion and lip sync without drawing a hidden preview. */
    advanceParameters(E) {
      W || L(E);
    },
    destroy() {
      W || (W = !0, cancelAnimationFrame(D), se.clear(), G.destroy());
    }
  };
}
const Os = Object.keys(bt);
async function Rs(t, e) {
  return ks(t, { ...e, rig: Yt(e.rig) });
}
function lt(t) {
  if (!t || typeof t != "object" || Array.isArray(t))
    throw new Error("avatar.json: expected an object");
  const e = t, n = [];
  e.format !== "mesh-avatar" && n.push('avatar.json.format: expected "mesh-avatar"'), e.version !== 1 && n.push(`avatar.json.version: unsupported version ${JSON.stringify(e.version) ?? "missing"} (expected 1)`), (typeof e.name != "string" || !e.name.trim()) && n.push("avatar.json.name: expected a non-empty string");
  const s = { format: "mesh-avatar", version: 1, name: e.name };
  for (const a of ["author", "license", "thumbnail", "source"])
    e[a] !== void 0 && (typeof e[a] != "string" ? n.push(`avatar.json.${a}: expected a string`) : s[a] = e[a]);
  if (e.studio !== void 0) {
    const a = e.studio;
    !a || typeof a != "object" || Array.isArray(a) || !("version" in a) || typeof a.version != "string" || !a.version.trim() ? n.push("avatar.json.studio.version: expected a non-empty string") : s.studio = { version: a.version };
  }
  if (e.lipSync !== void 0)
    try {
      s.lipSync = Ut(e.lipSync);
    } catch (a) {
      n.push(`avatar.json.lipSync: ${a instanceof Error ? a.message : String(a)}`);
    }
  if (e.expressions !== void 0)
    try {
      s.expressions = Pt(e.expressions);
    } catch (a) {
      n.push(`avatar.json.expressions: ${a instanceof Error ? a.message : String(a)}`);
    }
  if (n.length) throw new Error(n.join(`
`));
  return s;
}
function Fs(t) {
  return lt({ format: "mesh-avatar", version: 1, name: t });
}
const dt = (t) => !!t && typeof t == "object" && !Array.isArray(t), Ne = (t, e) => Array.isArray(t) && t.length === e && t.every((n) => typeof n == "number" && Number.isFinite(n)), kt = (t, e) => Object.hasOwn(t, e);
function _s(t) {
  const e = [];
  function n(f, l = !0) {
    if (!kt(t, f)) {
      l && e.push(`${f}: missing file`);
      return;
    }
    const p = t[f];
    if (!(p instanceof Uint8Array)) {
      e.push(`${f}: JSON bytes are required`);
      return;
    }
    let u;
    try {
      u = JSON.parse(new TextDecoder("utf-8", { fatal: !0 }).decode(p));
    } catch {
      e.push(`${f}: invalid UTF-8 JSON`);
      return;
    }
    if (!dt(u)) {
      e.push(`${f}: expected an object`);
      return;
    }
    return u;
  }
  function s(f, l, p = !0) {
    return f.version === 1 || p && f.version === void 0 ? !0 : (e.push(`${l}.version: unsupported version ${JSON.stringify(f.version) ?? "missing"} (expected 1)`), !1);
  }
  function a(f) {
    if (!kt(t, f)) {
      e.push(`${f}: missing file`);
      return;
    }
    const l = t[f], p = l instanceof Uint8Array ? l.byteLength : l?.size;
    (!Number.isSafeInteger(p) || p <= 0) && e.push(`${f}: expected a non-empty file`);
  }
  function o(f, l, p, u) {
    if (!dt(f)) {
      e.push(`${l}.layers: expected a layer rectangle map`);
      return;
    }
    for (const [v, r] of Object.entries(f)) {
      const d = `${l}.layers.${v}`;
      if (!/^[A-Za-z0-9_-]+$/.test(v)) {
        e.push(`${d}: expected a safe layer name (letters, digits, hyphens or underscores)`);
        continue;
      }
      !Ne(r, 4) || !r.every(Number.isInteger) || r[0] < 0 || r[1] < 0 || r[2] <= 0 || r[3] <= 0 ? e.push(`${d}: expected [x, y, width, height] with non-negative integer origins and positive integer dimensions`) : u && (r[0] + r[2] > u[0] || r[1] + r[3] > u[1]) && e.push(`${d}: rectangle must stay inside the image`), a(`${p}/${v}.png`);
    }
    return f;
  }
  function i(f, l) {
    (typeof f.build != "string" || !f.build.trim()) && e.push(`${l}.build: expected a non-empty string`);
  }
  const c = n("avatar.json", !1);
  if (c)
    try {
      lt(c);
    } catch (f) {
      e.push(f.message);
    }
  const w = n("rig.json");
  let y;
  if (w && s(w, "rig.json", !1)) {
    const f = hn(w);
    e.push(...f.map((l) => `rig.json: ${l}`)), f.length || (y = w);
  }
  a("built/base.png"), a("built/hairmask.png"), y?.cloth?.length && a("built/base_cloth.png");
  const g = n("built/layers.json");
  if (g && s(g, "built/layers.json")) {
    i(g, "built/layers.json");
    let f;
    !Ne(g.size, 2) || !g.size.every((p) => Number.isInteger(p) && p > 0) ? e.push("built/layers.json.size: expected [width, height] with positive integer dimensions") : (f = g.size, y && (f[0] !== y.image.width || f[1] !== y.image.height) && e.push("built/layers.json.size: must match rig.json.image"));
    const l = o(g.layers, "built/layers.json", "built", f);
    if (y && l) {
      const p = [
        ...y.eyes.flatMap((u, v) => ["ball", "low", "crease", "lash"].map((r) => `eye${v}_${r}`)),
        ...y.hand ? ["hand"] : [],
        ...(y.accessories ?? []).map((u) => u.name),
        ...(y.cloth ?? []).map((u) => `cloth_${u.name}`)
      ];
      for (const u of p) kt(l, u) || e.push(`built/layers.json.layers.${u}: missing required layer`);
    }
    !Array.isArray(g.eyes) || g.eyes.length !== 2 ? e.push("built/layers.json.eyes: expected two eye curves") : g.eyes.forEach((p, u) => {
      const v = `built/layers.json.eyes[${u}]`;
      if (!dt(p)) {
        e.push(`${v}: expected an object`);
        return;
      }
      Ne([p.x0, p.x1], 2) && p.x0 < p.x1 || e.push(`${v}: expected finite x0 < x1`);
      for (const r of ["top", "bot"])
        Ne(p[r], 24) || e.push(`${v}.${r}: expected 24 finite numbers`);
      if (Ne(p.top, 24) && Ne(p.bot, 24) && p.top.some((r, d) => r > p.bot[d]) && e.push(`${v}.top: must not exceed bottom curve`), y) for (const r of ["x0", "x1", "top", "bot"]) {
        const d = p[r], x = y.eyes[u][r];
        (Array.isArray(x) ? Ne(d, x.length) && d.every((b, A) => b === x[A]) : d === x) || e.push(`${v}.${r}: must match rig.json.eyes[${u}].${r}`);
      }
    });
  }
  const h = n("built/sprites/sprites.json", !1);
  h && s(h, "built/sprites/sprites.json") && (i(h, "built/sprites/sprites.json"), o(h.layers, "built/sprites/sprites.json", "built/sprites", y ? [y.image.width, y.image.height] : void 0));
  const m = n("built/overlays/overlays.json", !1);
  if (m && s(m, "built/overlays/overlays.json"))
    if (!Array.isArray(m.overlays)) e.push("built/overlays/overlays.json.overlays: expected an array");
    else {
      const f = /* @__PURE__ */ new Set();
      for (const [l, p] of m.overlays.entries()) {
        const u = `built/overlays/overlays.json.overlays[${l}]`;
        if (!dt(p) || typeof p.name != "string" || !/^[A-Za-z0-9_-]+$/.test(p.name) || typeof p.file != "string" || !/^[A-Za-z0-9_-]+\.png$/.test(p.file)) {
          e.push(`${u}: expected { name, file } with safe names`);
          continue;
        }
        f.has(p.name) && e.push(`${u}.name: duplicate overlay name`), f.add(p.name), a(`built/overlays/${p.file}`);
      }
    }
  return e;
}
var Se = Uint8Array, qe = Uint16Array, Bs = Int32Array, yn = new Se([
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  1,
  1,
  1,
  1,
  2,
  2,
  2,
  2,
  3,
  3,
  3,
  3,
  4,
  4,
  4,
  4,
  5,
  5,
  5,
  5,
  0,
  /* unused */
  0,
  0,
  /* impossible */
  0
]), bn = new Se([
  0,
  0,
  0,
  0,
  1,
  1,
  2,
  2,
  3,
  3,
  4,
  4,
  5,
  5,
  6,
  6,
  7,
  7,
  8,
  8,
  9,
  9,
  10,
  10,
  11,
  11,
  12,
  12,
  13,
  13,
  /* unused */
  0,
  0
]), $s = new Se([16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15]), vn = function(t, e) {
  for (var n = new qe(31), s = 0; s < 31; ++s)
    n[s] = e += 1 << t[s - 1];
  for (var a = new Bs(n[30]), s = 1; s < 30; ++s)
    for (var o = n[s]; o < n[s + 1]; ++o)
      a[o] = o - n[s] << 5 | s;
  return { b: n, r: a };
}, wn = vn(yn, 2), xn = wn.b, js = wn.r;
xn[28] = 258, js[258] = 28;
var Ys = vn(bn, 0), Us = Ys.b, $t = new qe(32768);
for (var pe = 0; pe < 32768; ++pe) {
  var Ce = (pe & 43690) >> 1 | (pe & 21845) << 1;
  Ce = (Ce & 52428) >> 2 | (Ce & 13107) << 2, Ce = (Ce & 61680) >> 4 | (Ce & 3855) << 4, $t[pe] = ((Ce & 65280) >> 8 | (Ce & 255) << 8) >> 1;
}
var it = (function(t, e, n) {
  for (var s = t.length, a = 0, o = new qe(e); a < s; ++a)
    t[a] && ++o[t[a] - 1];
  var i = new qe(e);
  for (a = 1; a < e; ++a)
    i[a] = i[a - 1] + o[a - 1] << 1;
  var c;
  if (n) {
    c = new qe(1 << e);
    var w = 15 - e;
    for (a = 0; a < s; ++a)
      if (t[a])
        for (var y = a << 4 | t[a], g = e - t[a], h = i[t[a] - 1]++ << g, m = h | (1 << g) - 1; h <= m; ++h)
          c[$t[h] >> w] = y;
  } else
    for (c = new qe(s), a = 0; a < s; ++a)
      t[a] && (c[a] = $t[i[t[a] - 1]++] >> 15 - t[a]);
  return c;
}), ht = new Se(288);
for (var pe = 0; pe < 144; ++pe)
  ht[pe] = 8;
for (var pe = 144; pe < 256; ++pe)
  ht[pe] = 9;
for (var pe = 256; pe < 280; ++pe)
  ht[pe] = 7;
for (var pe = 280; pe < 288; ++pe)
  ht[pe] = 8;
var Mn = new Se(32);
for (var pe = 0; pe < 32; ++pe)
  Mn[pe] = 5;
var Xs = /* @__PURE__ */ it(ht, 9, 1), zs = /* @__PURE__ */ it(Mn, 5, 1), Ot = function(t) {
  for (var e = t[0], n = 1; n < t.length; ++n)
    t[n] > e && (e = t[n]);
  return e;
}, Fe = function(t, e, n) {
  var s = e / 8 | 0;
  return (t[s] | t[s + 1] << 8) >> (e & 7) & n;
}, Rt = function(t, e) {
  var n = e / 8 | 0;
  return (t[n] | t[n + 1] << 8 | t[n + 2] << 16) >> (e & 7);
}, Ps = function(t) {
  return (t + 7) / 8 | 0;
}, Ct = function(t, e, n) {
  return (e == null || e < 0) && (e = 0), (n == null || n > t.length) && (n = t.length), new Se(t.subarray(e, n));
}, Cs = [
  "unexpected EOF",
  "invalid block type",
  "invalid length/literal",
  "invalid distance",
  "stream finished",
  "no stream handler",
  ,
  // determined by compression function
  "no callback",
  "invalid UTF-8 data",
  "extra field too long",
  "date not in range 1980-2099",
  "filename too long",
  "stream finishing",
  "invalid zip data"
  // determined by unknown compression method
], Te = function(t, e, n) {
  var s = new Error(e || Cs[t]);
  if (s.code = t, Error.captureStackTrace && Error.captureStackTrace(s, Te), !n)
    throw s;
  return s;
}, Is = function(t, e, n, s) {
  var a = t.length, o = s ? s.length : 0;
  if (!a || e.f && !e.l)
    return n || new Se(0);
  var i = !n, c = i || e.i != 2, w = e.i;
  i && (n = new Se(a * 3));
  var y = function(T) {
    var S = n.length;
    if (T > S) {
      var L = new Se(Math.max(S * 2, T));
      L.set(n), n = L;
    }
  }, g = e.f || 0, h = e.p || 0, m = e.b || 0, f = e.l, l = e.d, p = e.m, u = e.n, v = a * 8;
  do {
    if (!f) {
      g = Fe(t, h, 1);
      var r = Fe(t, h + 1, 3);
      if (h += 3, r)
        if (r == 1)
          f = Xs, l = zs, p = 9, u = 5;
        else if (r == 2) {
          var d = Fe(t, h, 31) + 257, x = Fe(t, h + 10, 15) + 4, b = d + Fe(t, h + 5, 31) + 1;
          h += 14;
          for (var A = new Se(b), F = new Se(19), U = 0; U < x; ++U)
            F[$s[U]] = Fe(t, h + U * 3, 7);
          h += x * 3;
          for (var ne = Ot(F), X = (1 << ne) - 1, G = it(F, ne, 1), U = 0; U < b; ) {
            var R = G[Fe(t, h, X)];
            h += R & 15;
            var I = R >> 4;
            if (I < 16)
              A[U++] = I;
            else {
              var B = 0, j = 0;
              for (I == 16 ? (j = 3 + Fe(t, h, 3), h += 2, B = A[U - 1]) : I == 17 ? (j = 3 + Fe(t, h, 7), h += 3) : I == 18 && (j = 11 + Fe(t, h, 127), h += 7); j--; )
                A[U++] = B;
            }
          }
          var Y = A.subarray(0, d), P = A.subarray(d);
          p = Ot(Y), u = Ot(P), f = it(Y, p, 1), l = it(P, u, 1);
        } else
          Te(1);
      else {
        var I = Ps(h) + 4, N = t[I - 4] | t[I - 3] << 8, q = I + N;
        if (q > a) {
          w && Te(0);
          break;
        }
        c && y(m + N), n.set(t.subarray(I, q), m), e.b = m += N, e.p = h = q * 8, e.f = g;
        continue;
      }
      if (h > v) {
        w && Te(0);
        break;
      }
    }
    c && y(m + 131072);
    for (var ae = (1 << p) - 1, J = (1 << u) - 1, $ = h; ; $ = h) {
      var B = f[Rt(t, h) & ae], ee = B >> 4;
      if (h += B & 15, h > v) {
        w && Te(0);
        break;
      }
      if (B || Te(2), ee < 256)
        n[m++] = ee;
      else if (ee == 256) {
        $ = h, f = null;
        break;
      } else {
        var Z = ee - 254;
        if (ee > 264) {
          var U = ee - 257, se = yn[U];
          Z = Fe(t, h, (1 << se) - 1) + xn[U], h += se;
        }
        var re = l[Rt(t, h) & J], te = re >> 4;
        re || Te(3), h += re & 15;
        var P = Us[te];
        if (te > 3) {
          var se = bn[te];
          P += Rt(t, h) & (1 << se) - 1, h += se;
        }
        if (h > v) {
          w && Te(0);
          break;
        }
        c && y(m + 131072);
        var oe = m + Z;
        if (m < P) {
          var z = o - P, M = Math.min(P, oe);
          for (z + m < 0 && Te(3); m < M; ++m)
            n[m] = s[z + m];
        }
        for (; m < oe; ++m)
          n[m] = n[m - P];
      }
    }
    e.l = f, e.p = $, e.b = m, e.f = g, f && (g = 1, e.m = p, e.d = l, e.n = u);
  } while (!g);
  return m != n.length && i ? Ct(n, 0, m) : n.subarray(0, m);
}, Ns = /* @__PURE__ */ new Se(0), $e = function(t, e) {
  return t[e] | t[e + 1] << 8;
}, Oe = function(t, e) {
  return (t[e] | t[e + 1] << 8 | t[e + 2] << 16 | t[e + 3] << 24) >>> 0;
}, Ft = function(t, e) {
  return Oe(t, e) + Oe(t, e + 4) * 4294967296;
};
function Ds(t, e) {
  return Is(t, { i: 2 }, e && e.out, e && e.dictionary);
}
var jt = typeof TextDecoder < "u" && /* @__PURE__ */ new TextDecoder(), Zs = 0;
try {
  jt.decode(Ns, { stream: !0 }), Zs = 1;
} catch {
}
var Ws = function(t) {
  for (var e = "", n = 0; ; ) {
    var s = t[n++], a = (s > 127) + (s > 223) + (s > 239);
    if (n + a > t.length)
      return { s: e, r: Ct(t, n - 1) };
    a ? a == 3 ? (s = ((s & 15) << 18 | (t[n++] & 63) << 12 | (t[n++] & 63) << 6 | t[n++] & 63) - 65536, e += String.fromCharCode(55296 | s >> 10, 56320 | s & 1023)) : a & 1 ? e += String.fromCharCode((s & 31) << 6 | t[n++] & 63) : e += String.fromCharCode((s & 15) << 12 | (t[n++] & 63) << 6 | t[n++] & 63) : e += String.fromCharCode(s);
  }
};
function Gs(t, e) {
  if (e) {
    for (var n = "", s = 0; s < t.length; s += 16384)
      n += String.fromCharCode.apply(null, t.subarray(s, s + 16384));
    return n;
  } else {
    if (jt)
      return jt.decode(t);
    var a = Ws(t), o = a.s, n = a.r;
    return n.length && Te(8), o;
  }
}
var Vs = function(t, e) {
  return e + 30 + $e(t, e + 26) + $e(t, e + 28);
}, Hs = function(t, e, n) {
  var s = $e(t, e + 28), a = $e(t, e + 30), o = Gs(t.subarray(e + 46, e + 46 + s), !($e(t, e + 8) & 2048)), i = e + 46 + s, c = qs(t, i, a, n, Oe(t, e + 20), Oe(t, e + 24), Oe(t, e + 42)), w = c[0], y = c[1], g = c[2];
  return [$e(t, e + 10), w, y, o, i + a + $e(t, e + 32), g];
}, qs = function(t, e, n, s, a, o, i) {
  var c = a == 4294967295, w = o == 4294967295, y = i == 4294967295, g = e + n, h = c + w + y;
  if (s && h) {
    for (; e + 4 < g; e += 4 + $e(t, e + 2))
      if ($e(t, e) == 1)
        return [
          c ? Ft(t, e + 4 + 8 * w) : a,
          w ? Ft(t, e + 4) : o,
          y ? Ft(t, e + 4 + 8 * (w + c)) : i,
          1
        ];
    s < 2 && Te(13);
  }
  return [a, o, i, 0];
};
function Js(t, e) {
  for (var n = {}, s = t.length - 22; Oe(t, s) != 101010256; --s)
    (!s || t.length - s > 65558) && Te(13);
  var a = $e(t, s + 8);
  if (!a)
    return {};
  var o = Oe(t, s + 16), i = Oe(t, s - 20) == 117853008;
  if (i) {
    var c = Oe(t, s - 12);
    i = Oe(t, c) == 101075792, i && (a = Oe(t, c + 32), o = Oe(t, c + 48));
  }
  for (var w = e && e.filter, y = 0; y < a; ++y) {
    var g = Hs(t, o, i), h = g[0], m = g[1], f = g[2], l = g[3], p = g[4], u = g[5], v = Vs(t, u);
    o = p, (!w || w({
      name: l,
      size: m,
      originalSize: f,
      compression: h
    })) && (h ? h == 8 ? n[l] = Ds(t.subarray(v, v + m), { out: new Se(f) }) : Te(14, "unknown compression type " + h) : n[l] = Ct(t, v, v + m));
  }
  return n;
}
const sn = 200, an = 64 * 1024 * 1024, rn = new TextDecoder("utf-8", { fatal: !0 });
function An(t) {
  if (!t || t.startsWith("/") || /^[A-Za-z]:/.test(t) || t.includes("\\") || t.includes("\0") || t.split("/").includes(".."))
    throw new Error(`ZIP entry ${JSON.stringify(t)}: path must be relative, without .. or backslashes`);
}
function Ks(t) {
  const e = new DataView(t.buffer, t.byteOffset, t.byteLength), n = (m = "(archive)") => {
    throw new Error(`ZIP entry ${JSON.stringify(m)}: invalid or truncated ZIP`);
  }, s = (m) => m >= 0 && m + 2 <= t.length ? e.getUint16(m, !0) : n(), a = (m) => m >= 0 && m + 4 <= t.length ? e.getUint32(m, !0) : n();
  let o = t.length - 22;
  for (; o >= Math.max(0, t.length - 65557) && !(a(o) === 101010256 && o + 22 + s(o + 20) === t.length); o--)
    ;
  (o < 0 || o < t.length - 65557) && n(), (s(o + 4) || s(o + 6) || s(o + 8) !== s(o + 10)) && n();
  const i = s(o + 10), c = a(o + 16), w = c + a(o + 12);
  w !== o && n();
  const y = [], g = /* @__PURE__ */ new Set();
  let h = c;
  for (let m = 0; m < i; m++) {
    (h + 46 > w || a(h) !== 33639248) && n();
    const f = s(h + 28), l = h + 46 + f + s(h + 30) + s(h + 32);
    l > w && n();
    let p;
    try {
      p = rn.decode(t.subarray(h + 46, h + 46 + f));
    } catch {
      throw new Error("ZIP entry (invalid UTF-8 name): invalid filename");
    }
    if (An(p), m >= sn) throw new Error(`ZIP entry ${JSON.stringify(p)}: more than ${sn} entries`);
    if (g.has(p)) throw new Error(`ZIP entry ${JSON.stringify(p)}: duplicate entry`);
    g.add(p);
    const u = a(h + 24), v = a(h + 20), r = a(h + 42);
    if (u > an || v > an) throw new Error(`ZIP entry ${JSON.stringify(p)}: exceeds 64 MB`);
    if (s(h + 10) !== 0) throw new Error(`ZIP entry ${JSON.stringify(p)}: expected stored compression (method 0)`);
    if (s(h + 8) & 1) throw new Error(`ZIP entry ${JSON.stringify(p)}: encrypted entries are not supported`);
    (v !== u || r + 30 > c || a(r) !== 67324752) && n(p);
    const d = r + 30 + s(r + 26) + s(r + 28);
    (d + u > c || s(r + 8) !== 0 || s(r + 6) !== s(h + 8)) && n(p);
    let x;
    try {
      x = rn.decode(t.subarray(r + 30, r + 30 + s(r + 26)));
    } catch {
      n(p);
    }
    x !== p && n(p), y.push({ name: p, offset: r, start: d, size: u, central: h }), h = l;
  }
  return h !== w && n(), { files: y };
}
function Qs(t) {
  const e = t instanceof Uint8Array ? t : new Uint8Array(t), n = Ks(e), s = Js(e, { filter: (o) => o.name !== "__proto__" }), a = /* @__PURE__ */ Object.create(null);
  for (const o of n.files) {
    const i = o.name === "__proto__" ? e.slice(o.start, o.start + o.size) : s[o.name];
    if (!(i instanceof Uint8Array) || i.length !== o.size) throw new Error(`ZIP entry ${JSON.stringify(o.name)}: invalid size`);
    a[o.name] = i;
  }
  return a;
}
const ea = (t) => JSON.parse(new TextDecoder("utf-8", { fatal: !0 }).decode(t));
function He(t, e) {
  try {
    return ea(t);
  } catch {
    throw new Error(`${e}: invalid UTF-8 JSON`);
  }
}
function En(t, e, n, s) {
  return [
    "layers.json",
    "base.png",
    "hairmask.png",
    ...s?.cloth?.length ? ["base_cloth.png"] : [],
    ...Object.keys(t?.layers ?? {}).map((a) => `${a}.png`),
    ...e ? ["sprites/sprites.json", ...Object.keys(e.layers ?? {}).map((a) => `sprites/${a}.png`)] : [],
    // malformed entries are left to validateAvatarFiles, which reports them
    ...n ? ["overlays/overlays.json", ...(Array.isArray(n.overlays) ? n.overlays : []).flatMap((a) => typeof a?.file == "string" ? [`overlays/${a.file}`] : [])] : []
  ];
}
function Tn(t) {
  const e = _s(t);
  if (e.length) throw new Error(e.join(`
`));
}
function Sn(t) {
  return !!t && typeof t == "object" && "manifest" in t && "rig" in t && "assets" in t && "release" in t;
}
function _t(t) {
  const e = Qs(t);
  if (!Object.hasOwn(e, "avatar.json")) throw new Error("avatar.json: missing file in .mavatar archive");
  Tn(e);
  const n = lt(He(e["avatar.json"], "avatar.json")), s = Yt(He(e["rig.json"], "rig.json")), a = e["built/overlays/overlays.json"] ? He(e["built/overlays/overlays.json"], "built/overlays/overlays.json") : void 0, o = En(
    He(e["built/layers.json"], "built/layers.json"),
    e["built/sprites/sprites.json"] ? He(e["built/sprites/sprites.json"], "built/sprites/sprites.json") : void 0,
    a,
    s
  ), i = {}, c = [], w = () => {
    c.splice(0).forEach((y) => URL.revokeObjectURL(y));
  };
  try {
    for (const y of new Set(o)) {
      const g = URL.createObjectURL(new Blob([new Uint8Array(e[`built/${y}`])], { type: y.endsWith(".json") ? "application/json" : "image/png" }));
      c.push(g), i[y] = g;
    }
  } catch (y) {
    throw w(), y;
  }
  return { manifest: n, rig: s, assets: i, release: w };
}
async function ta(t, e = {}) {
  if (Sn(t)) return t;
  if (t instanceof Blob) return _t(await t.arrayBuffer());
  if (t instanceof ArrayBuffer || t instanceof Uint8Array) return _t(t);
  const n = new URL(t, typeof location > "u" ? void 0 : location.href);
  if (/\.mavatar$/i.test(n.pathname)) {
    const u = await fetch(n);
    if (!u.ok) throw new Error(`.mavatar: could not load (${u.status})`);
    return _t(await u.arrayBuffer());
  }
  n.pathname.endsWith("/") || (n.pathname += "/");
  const s = (u) => {
    const v = new URL(n);
    return v.pathname += u.split("/").map(encodeURIComponent).join("/"), e.version !== void 0 && v.searchParams.set("v", String(e.version)), v.href;
  }, a = {};
  async function o(u, v = !1) {
    const r = await fetch(s(u));
    if (v && (r.status === 404 || r.ok && r.headers.get("content-type")?.includes("text/html"))) return;
    if (!r.ok) throw new Error(`${u}: could not load (${r.status})`);
    const d = new Uint8Array(await r.arrayBuffer());
    return a[u] = d, He(d, u);
  }
  const i = e.rigFile ?? "rig.json";
  An(i);
  const [c, w, y, g, h] = await Promise.all([
    o(i),
    o("built/layers.json"),
    o("avatar.json", !0),
    o("built/sprites/sprites.json", !0),
    o("built/overlays/overlays.json", !0)
  ]);
  Array.isArray(c?.eyes) && Array.isArray(w?.eyes) && (c.eyes = c.eyes.map((u, v) => {
    if (!u || typeof u != "object") return u;
    const r = { ...u };
    for (const d of ["x0", "x1", "top", "bot"]) r[d] === void 0 && (r[d] = w.eyes[v]?.[d]);
    return r;
  })), a["rig.json"] = new TextEncoder().encode(JSON.stringify(c));
  const m = En(w, g, h, c);
  for (const u of m) u.endsWith(".png") && (a[`built/${u}`] = { size: 1 });
  Tn(a);
  const f = Yt(c), l = Object.fromEntries(m.map((u) => [u, s(`built/${u}`)])), p = decodeURIComponent(n.pathname.split("/").filter(Boolean).at(-1) ?? "Avatar");
  return { manifest: y === void 0 ? Fs(p) : lt(y), rig: f, assets: l, release() {
  } };
}
async function na(t, e, n = {}) {
  const s = !Sn(e), a = await ta(e);
  try {
    const o = n.lipSync === void 0 ? a.manifest.lipSync : { ...a.manifest.lipSync, ...Ut(n.lipSync) }, i = n.expressions === void 0 ? a.manifest.expressions : Ts(a.manifest.expressions, Pt(n.expressions)), c = await Rs(t, {
      ...n,
      ...o === void 0 ? {} : { lipSync: o },
      ...i === void 0 ? {} : { expressions: i },
      rig: a.rig,
      assets: a.assets
    }), w = c.destroy.bind(c);
    let y = !1;
    return Object.assign(c, { package: a, destroy() {
      if (!y) {
        y = !0;
        try {
          w();
        } finally {
          s && a.release();
        }
      }
    } });
  } catch (o) {
    throw s && a.release(), o;
  }
}
const sa = "https://shinshin86.github.io/mesh-avatar-studio/miko.mavatar", aa = ["happy", "sad", "angry", "surprised", "relaxed", "neutral"];
function ra(t) {
  return t === null || t === "" ? "neutral" : Os.includes(t) ? t : void 0;
}
function oa(t) {
  return t === null || t === "" ? null : aa.includes(t) ? t : void 0;
}
function on(t) {
  return t === null || t === "" ? "contain" : t === "contain" || t === "cover" ? t : void 0;
}
function ia(t) {
  return t ? t.split(/\s+/).filter(Boolean) : [];
}
function la(t, e) {
  return Math.min(0.05, Math.max(1e-3, (t - e) / 1e3));
}
class ha {
  promise;
  #n;
  #e;
  #t = !0;
  /** Call when a load starts. */
  start() {
    this.#t && (this.#t = !1, this.promise = new Promise((e, n) => {
      this.#n = e, this.#e = n;
    }), this.promise.catch(() => {
    }));
  }
  resolve(e) {
    this.#t || (this.#t = !0, this.#n(e));
  }
  reject(e) {
    this.#t || (this.#t = !0, this.#e(e));
  }
}
const ua = `
:host { display: block; position: relative; aspect-ratio: 1 / 1; }
:host([hidden]) { display: none; }
canvas { display: block; width: 100%; height: 100%; }
`, ca = typeof HTMLElement > "u" ? class {
} : HTMLElement;
class ma extends ca {
  static observedAttributes = ["src", "fit", "expression", "emotion", "paused", "no-idle", "label", "overlays"];
  #n;
  #e = null;
  #t = new ha();
  #i = 0;
  #a = !1;
  #r = null;
  #u;
  #o = 0;
  #c = 0;
  #g = !0;
  #m = null;
  #p = null;
  #l = {};
  #y = /* @__PURE__ */ new Set();
  constructor() {
    super();
    const e = this.attachShadow({ mode: "open" }), n = document.createElement("style");
    n.textContent = ua, this.#n = document.createElement("canvas"), this.#n.setAttribute("role", "img"), this.#n.setAttribute("aria-label", "Avatar"), e.append(n, this.#n), this.#t.start(), this.#n.addEventListener("webglcontextlost", (s) => {
      s.preventDefault(), this.#h();
    }), this.#n.addEventListener("webglcontextrestored", () => this.#f());
  }
  /** The loaded runtime avatar, or null while loading. Every `mesh-avatar` method is available on it. */
  get avatar() {
    return this.#e;
  }
  /** Resolves with the avatar once the current source has loaded. */
  get ready() {
    return this.#t.promise;
  }
  /** Loads a file, archive or URL without changing `src`. A changed `src` replaces this source. */
  load(e) {
    return this.#r = null, this.#u = e, this.#f(), this.ready;
  }
  get src() {
    return this.getAttribute("src") ?? "";
  }
  set src(e) {
    this.setAttribute("src", e);
  }
  get fit() {
    return on(this.getAttribute("fit")) ?? "contain";
  }
  set fit(e) {
    this.setAttribute("fit", e);
  }
  get expression() {
    return this.getAttribute("expression") ?? "neutral";
  }
  set expression(e) {
    this.setAttribute("expression", e);
  }
  get emotion() {
    return this.getAttribute("emotion");
  }
  set emotion(e) {
    e === null ? this.removeAttribute("emotion") : this.setAttribute("emotion", e);
  }
  get paused() {
    return this.hasAttribute("paused");
  }
  set paused(e) {
    this.toggleAttribute("paused", e);
  }
  /** Overlay layers to show, such as glasses (the avatar's built/overlays). Kept across loads. */
  get overlays() {
    return ia(this.getAttribute("overlays"));
  }
  set overlays(e) {
    e.length ? this.setAttribute("overlays", e.join(" ")) : this.removeAttribute("overlays");
  }
  /** Mouth opening from the voice loudness, 0 to 1. Kept until the avatar loads. */
  setVoiceLevel(e) {
    this.#p = e, this.#e?.setVoiceLevel(e);
  }
  /** Explicit mouth-movement overrides, retained across loads. Assignment is a partial update. */
  get lipSync() {
    return { ...this.#l };
  }
  set lipSync(e) {
    this.setLipSync(e);
  }
  /** Partial overrides of the avatar's saved mouth-movement settings, retained across loads. */
  setLipSync(e) {
    const n = lt({ format: "mesh-avatar", version: 1, name: "Avatar", lipSync: e }).lipSync;
    this.#e?.setLipSync(n), this.#l = { ...this.#l, ...n };
  }
  /** Moves the mouth to Japanese text without audio. Waits for the avatar to load. */
  async speak(e, n) {
    (await this.ready).speakKana(e, n);
  }
  /** Plays a motion by id (see `avatar.motions`). Waits for the avatar to load. */
  async play(e) {
    (await this.ready).play(e);
  }
  connectedCallback() {
    this.#m ??= new IntersectionObserver((e) => {
      this.#g = e.at(-1)?.isIntersecting ?? !0, this.#s();
    }), this.#m.observe(this), document.addEventListener("visibilitychange", this.#s), !this.#e && !this.#a ? this.#v() : this.#s();
  }
  disconnectedCallback() {
    this.#m?.disconnect(), document.removeEventListener("visibilitychange", this.#s), this.#h(), queueMicrotask(() => {
      this.isConnected || this.#w();
    });
  }
  attributeChangedCallback(e, n, s) {
    n !== s && (e === "src" || e === "fit" ? (e === "src" && (this.#u = void 0), e === "fit" && on(s) === void 0 && this.#d(e, s), this.isConnected && this.#v()) : e === "label" ? this.#n.setAttribute("aria-label", s || "Avatar") : e === "paused" ? this.#s() : this.#e && this.#b(this.#e, e));
  }
  #b(e, n) {
    if (n === "expression") {
      const s = ra(this.getAttribute("expression"));
      s ? e.setExpression(s) : this.#d(n, this.getAttribute(n));
    } else if (n === "emotion") {
      const s = oa(this.getAttribute("emotion"));
      s !== void 0 ? e.setEmotion(s) : this.#d(n, this.getAttribute(n));
    } else n === "no-idle" ? e.setAutoIdle(!this.hasAttribute("no-idle")) : n === "overlays" && e.setOverlays(this.overlays);
  }
  #v() {
    if (this.#t.start(), this.#r) return;
    const e = this.#r = {};
    queueMicrotask(() => {
      this.#r === e && (this.#r = null, this.isConnected && this.#f());
    });
  }
  async #f(e = this.#u ?? (this.getAttribute("src") || sa)) {
    const n = ++this.#i;
    this.#w(!1), this.#a = !0, this.#t.start();
    try {
      const s = await na(this.#n, e, { manual: !0, fit: this.fit });
      if (n !== this.#i) {
        s.destroy();
        return;
      }
      this.#a = !1, this.#e = s;
      for (const a of ["expression", "emotion", "no-idle", "overlays"])
        (a !== "emotion" || this.hasAttribute(a)) && this.#b(s, a);
      this.#p !== null && s.setVoiceLevel(this.#p), s.setLipSync(this.#l), matchMedia("(prefers-reduced-motion: reduce)").matches && s.setSwayGain(0.5), s.onMotion((a) => this.dispatchEvent(new CustomEvent("motion", { detail: { id: a } }))), s.advance(0), this.#t.resolve(s), this.dispatchEvent(new CustomEvent("load", { detail: { avatar: s } })), this.#s();
    } catch (s) {
      if (n !== this.#i) return;
      this.#a = !1, this.#t.reject(s), this.dispatchEvent(new CustomEvent("error", { detail: { error: s } }));
    }
  }
  /** Destroys the avatar. Without `cancel = false` it also abandons a load in progress. */
  #w(e = !0) {
    e && (this.#i++, this.#a = !1), this.#h(), this.#e?.destroy(), this.#e = null;
  }
  #s = () => {
    const e = this.#e && this.isConnected && this.#g && !document.hidden && !this.paused;
    e && !this.#o ? (this.#c = performance.now(), this.#o = requestAnimationFrame(this.#x)) : e || this.#h();
  };
  #x = (e) => {
    const n = la(e, this.#c);
    this.#c = e, this.#e?.advance(n, 1 / n), this.#o = requestAnimationFrame(this.#x);
  };
  #h() {
    cancelAnimationFrame(this.#o), this.#o = 0;
  }
  #d(e, n) {
    const s = `${e}=${n}`;
    this.#y.has(s) || (this.#y.add(s), console.warn(`<mesh-avatar> ignores ${e}="${n}".`));
  }
}
typeof customElements < "u" && !customElements.get("mesh-avatar") && customElements.define("mesh-avatar", ma);
export {
  sa as DEFAULT_SRC,
  aa as EMOTIONS,
  ma as MeshAvatarElement
};
