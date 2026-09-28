import{c}from"./index-3u9HHIt7.js";/**
 * @license lucide-react v0.460.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const s=c("CloudUpload",[["path",{d:"M12 13v8",key:"1l5pq0"}],["path",{d:"M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242",key:"1pljnt"}],["path",{d:"m8 17 4-4 4 4",key:"1quai1"}]]);function g(o,d=1100,h=.8){return new Promise((i,r)=>{if(!/^image\//.test(o.type))return r(new Error("Only image files are supported."));const a=URL.createObjectURL(o),e=new Image;e.onload=()=>{const n=Math.min(1,d/Math.max(e.width,e.height)),t=document.createElement("canvas");t.width=Math.round(e.width*n),t.height=Math.round(e.height*n),t.getContext("2d").drawImage(e,0,0,t.width,t.height),URL.revokeObjectURL(a),i(t.toDataURL("image/webp",h))},e.onerror=()=>{URL.revokeObjectURL(a),r(new Error("Could not read that image."))},e.src=a})}export{s as C,g as f};
