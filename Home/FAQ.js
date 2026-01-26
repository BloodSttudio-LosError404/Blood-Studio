const faqs = [
  {
    question: "How to use this component?",
    answer:
      "To use this component, you need to import it in your project and use it in your JSX or HTML."
  },
  {
    question: "Are there any other components available?",
    answer:
      "Yes, there are many other components available in this library."
  },
  {
    question: "Are components responsive?",
    answer:
      "Yes, all components are fully responsive and adapt to different screen sizes."
  },
  {
    question: "Can I customize the components?",
    answer:
      "Yes, you can customize them easily using CSS or configuration options."
  }
];

const container = document.getElementById("faqContainer");

faqs.forEach(faq => {
  const item = document.createElement("div");
  item.className = "faq-item";

  item.innerHTML = `
    <div class="faq-header">
      <h3>${faq.question}</h3>
      <svg class="faq-icon" width="18" height="18" viewBox="0 0 18 18">
        <path d="m4.5 7.2 3.8 3.8a1 1 0 0 0 1.4 0l3.8-3.8"
          stroke="#1D293D" stroke-width="1.5"
          stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </div>
    <p class="faq-answer">${faq.answer}</p>
  `;

  item.querySelector(".faq-header").addEventListener("click", () => {
    document.querySelectorAll(".faq-item").forEach(el => {
      if (el !== item) el.classList.remove("active");
    });
    item.classList.toggle("active");
  });

  container.appendChild(item);
});
