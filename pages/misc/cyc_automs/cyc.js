// the current limit of our GIF supply
var N = 6


// moves back through the tree one step
function back() {
  var rt = document.getElementById("righttop");
  var rb = document.getElementById("rightbottom");
  var l = document.getElementById("left");

  var L = l.alt.length;
  var Lm = l.alt.length-1;

  if(L > 1) {
    l.src = "cyc_automs_assets/" + Lm + "/" + l.alt.substring(0,Lm) + ".gif"
    rt.src = "cyc_automs_assets/" + L + "/" + l.alt.substring(0,Lm) + "0" + ".gif"
    rb.src = "cyc_automs_assets/" + L + "/" + l.alt.substring(0,Lm) + "1" + ".gif"

    document.getElementById("labell").textContent = l.alt.substring(0,Lm);
    document.getElementById("labelrt").textContent = l.alt.substring(0,Lm) + "0";
    document.getElementById("labelrb").textContent = l.alt.substring(0,Lm) + "1";

    l_alt = l.alt;
    l.alt = l_alt.substring(0,Lm)
    rt.alt = l_alt.substring(0,Lm) + "0"
    rb.alt = l_alt.substring(0,Lm) + "1"

    rt.style.visibility = "visible"
    rb.style.visibility = "visible"

  }

}


// moves forward through the tree, adding a 0 to the end of the current aut label
function forwardZero() {
  var rt = document.getElementById("righttop");
  var rb = document.getElementById("rightbottom");
  var l = document.getElementById("left");

  var L = rt.alt.length;
  var Lp = rt.alt.length+1;

  if(L < N) {
    l.src = "cyc_automs_assets/" + L + "/" + rt.alt + ".gif"
    rt.src = "cyc_automs_assets/" + Lp + "/" + rt.alt + "0" + ".gif"
    rb.src = "cyc_automs_assets/" + Lp + "/" + rt.alt + "1" + ".gif"

    document.getElementById("labell").textContent = rt.alt;
    document.getElementById("labelrt").textContent = rt.alt + "0";
    document.getElementById("labelrb").textContent = rt.alt + "1";

    l.alt = rt.alt
    rt_alt = rt.alt;
    rt.alt = rt_alt + "0"
    rb.alt = rt_alt + "1"

  } else {
    // in this case we hide the missing images
    l.src = "cyc_automs_assets/" + L + "/" + rt.alt + ".gif"
    document.getElementById("labell").textContent = rt.alt;
    document.getElementById("labelrt").textContent = rt.alt + "0";
    document.getElementById("labelrb").textContent = rt.alt + "1";

    l.alt = rt.alt
    rt.alt = rt.alt + "0"
    rb.alt = rt.alt + "1"

    rt.style.visibility = "hidden"
    rb.style.visibility = "hidden"
  }

}




// moves forward through the tree, adding a 1 to the end of the current aut label
function forwardOne() {
  var rt = document.getElementById("righttop");
  var rb = document.getElementById("rightbottom");
  var l = document.getElementById("left");

  var L = rb.alt.length;
  var Lp = rb.alt.length+1;

  if(L < N) {
    l.src = "cyc_automs_assets/" + L + "/" + rb.alt + ".gif"
    rt.src = "cyc_automs_assets/" + Lp + "/" + rb.alt + "0" + ".gif"
    rb.src = "cyc_automs_assets/" + Lp + "/" + rb.alt + "1" + ".gif"

    document.getElementById("labell").textContent = rb.alt;
    document.getElementById("labelrt").textContent = rb.alt + "0";
    document.getElementById("labelrb").textContent = rb.alt + "1";

    l.alt = rb.alt
    rt.alt = rb.alt + "0"
    rb.alt = rb.alt + "1"

  } else {
    // in this case we hide the missing images
    l.src = "cyc_automs_assets/" + L + "/" + rb.alt + ".gif"
    document.getElementById("labell").textContent = rb.alt;
    document.getElementById("labelrt").textContent = rb.alt + "0";
    document.getElementById("labelrb").textContent = rb.alt + "1";

    l.alt = rb.alt
    rt.alt = rb.alt + "0"
    rb.alt = rb.alt + "1"

    rt.style.visibility = "hidden"
    rb.style.visibility = "hidden"
  }

}


// checks if an input is just 1s and 0s, and of the right length
// and also that the input starts with a 1
function validateInput(str) {
  var is_valid = true;
  for (let i = 0; i < str.length; i++) {
    if (str[i] != "0" && str[i] !="1") {
      is_valid = false;
      return is_valid;
    }
  }
  if (str.length > N) {
    is_valid = false;
  }
  if (str[0] != "1") {
    is_valid = false;
  }
  return is_valid;
}


// reverses a string
// because my convention is backwards to what javascript does
// "are we the baddies?"
function reverseString(str) {
  return str.split("").reverse().join("");
}


// computes the product of the two automorphisms as typed in the input boxes
function prod() {

  var aut1 = document.getElementById("aut1");
  var aut2 = document.getElementById("aut2");

  var aut1v = aut1.value;
  var aut2v = aut2.value;

  if (validateInput(aut1v) && validateInput(aut2v)) {
    min_deg = Math.min(aut1v.length,aut2v.length);
    product = (parseInt(reverseString(aut1v),2) * parseInt(reverseString(aut2v),2)) % 2**min_deg
    product_label = reverseString(product.toString(2)).padEnd(min_deg,"0");

    src1 = "cyc_automs_assets/" + aut1v.length + "/" + aut1v + ".gif";
    src2 = "cyc_automs_assets/" + aut2v.length + "/" + aut2v + ".gif";
    product_src = "cyc_automs_assets/" + min_deg + "/" + product_label + ".gif";;

    // changing the images
    document.getElementById("first").src = src1;
    document.getElementById("second").src = src2;
    document.getElementById("product").src = product_src;

    // changing the labels
    document.getElementById("label1").textContent = aut1.value;
    document.getElementById("label2").textContent = aut2.value;
    document.getElementById("labelp").textContent = product_label;

  }

}
