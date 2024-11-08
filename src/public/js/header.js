// document.addEventListener("DOMContentLoaded", function() {
//     // Create header element
//     const header = document.createElement('header');
//     header.style.position = 'absolute';
//     header.style.top = '4%';
//     header.style.left = '50%';
//     header.style.transform = 'translate(-50%, -50%)';
//     header.style.width = '80%'; // Set width to 80% of the viewport
//     header.style.display = 'flex';
//     header.style.justifyContent = 'space-between';
//     header.style.alignItems = 'center';
//     header.style.padding = '0.5rem 2rem 0.5rem 1rem';
//     header.style.backgroundColor = 'rgb(0 0 0 / 30%)'; // Add a hint of grey
//     header.style.color = '#fff';
//     header.style.backdropFilter = 'blur(10px)';
//     header.style.webkitBackdropFilter = 'blur(10px)';
//     header.style.borderRadius = '25px'; // Make it look like a pill

//     // Add logo
//     const logo = document.createElement('img');
//     logo.src = '../img/Orbital-LOGO-sharpened.png';
//     logo.alt = 'Orbital Logo';
//     logo.style.height = '40px'; // Adjust height to fit the compact design
//     header.appendChild(logo);

//     // Add navigation
//     const nav = document.createElement('nav');
//     nav.innerHTML = `
//         <ul style="list-style: none; display: flex; gap: 1rem; margin: 0;">
//             <li><a href="/" style="color: #fff; text-decoration: none;">Home</a></li>
//             <li><a href="/about" style="color: #fff; text-decoration: none;">About</a></li>
//             <li><a href="/contact" style="color: #fff; text-decoration: none;">Contact</a></li>
//         </ul>
//     `;
//     header.appendChild(nav);

//     document.body.insertBefore(header, document.body.firstChild);
// });
