// Const bool to tell if we are at home page
const ARE_WE_HOME = document.documentElement.classList.contains("home")

function $$ (selector, context = document) {
    return Array.from(context.querySelectorAll(selector));
}

// Adding the light/dark theme switch
// Creating its label
const label = document.createElement("label")
label.className = "color-scheme"
label.textContent = "Theme: ";

// Creating the select field
const select = document.createElement('select')

// Adding the options
const options = [
    'light dark',
    'light',
    'dark',
]
options.forEach(optionText => {
    const option = document.createElement('option')
    option.value = optionText.toLowerCase()
    option.textContent = optionText;
    select.appendChild(option)
})

// Adding the select field
label.appendChild(select)

// Adding the switch to the page
document.body.insertAdjacentElement('afterbegin', label)

// Geting the light dark switch working
let select_switch = document.querySelector("select")

// Making it change when getting an input
select.addEventListener("input", function (event) {
    let selectedValue = event.target.value
    
    // Setting color-scheme in the root element
    console.log("color scheme changed to", selectedValue)
    // document.documentElement.style.setProperty("color-scheme", selectedValue)
    document.querySelector("html").style.setProperty("color-scheme", selectedValue)
    
    // Saving user preference
    localStorage.colorScheme = selectedValue
})

// Applying user preference theme on page load
if (localStorage.colorScheme) {
    document.querySelector("html").style.setProperty("color-scheme", localStorage.colorScheme)
    // document.documentElement.style.setProperty("color-scheme", localStorage.colorScheme)
    select_switch.value = localStorage.colorScheme
}