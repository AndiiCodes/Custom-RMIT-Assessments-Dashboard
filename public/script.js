
document.addEventListener("DOMContentLoaded", async () => {
   document.getElementById("loader").style.display = "block";
   document.getElementById("loader").style.display = "block";

   const closeIcon = document.querySelector(".info__close svg");
   const inf2 = document.querySelector(".info-container");
   closeIcon.addEventListener("click", () => {
     inf2.style.display = "none";
   });
  try {
    await fetchAndDisplayCourses();
    document.getElementById("loader").style.display = "none";
    document.getElementById("container").style.display = "grid";
  } catch (error) {
    console.error("Error:", error);
  }
});

async function fetchAndDisplayCourses() {
  try {
    const response = await fetch(
      "https://canvas-server-production.up.railway.app/api/courses"
    );
    if (!response.ok) {
      throw new Error("Failed to fetch courses");
    }
    let courses = await response.json();

    courses = courses.filter(
      (course) =>
        course.name !== "Succeed VE 2024" &&
        course.name !== "Dip of Information Technology (2405)"&&
        course.name !== "How2RMIT"&&
        course.name !== "Academic Integrity Awareness"
    );

    const container = document.getElementById("container");
    container.innerHTML = "";

    for (const course of courses) {
      const assessments = await fetchAssessments(course.id);
      const currentDate = new Date();
      const filteredAssessments = assessments.filter(
        (assessment) =>
          ((!assessment.due_at &&
            !assessment.unlock_at &&
            !assessment.lock_at) ||
            ((!assessment.due_at ||
              new Date(assessment.due_at) > currentDate) &&
              (!assessment.unlock_at ||
                new Date(assessment.unlock_at) <= currentDate) &&
              (!assessment.lock_at ||
                new Date(assessment.lock_at) > currentDate))) &&
          assessment.html_url &&
          (!assessment.lock_explanation ||
            !assessment.lock_explanation.includes("not available")) &&
          assessment.submission_types &&
          !assessment.submission_types.includes("discussion_topic") &&
          !assessment.name.toLowerCase().includes("pre-quiz") &&
          !assessment.name.toLowerCase().includes("pre-course")
      );

      if (filteredAssessments.length === 0) {
        continue;
      }

      const card = document.createElement("div");
      card.classList.add("card");

      const title = document.createElement("h3");
      title.classList.add("card__title");
      title.textContent = course.name;

      const content = document.createElement("ul");
      content.classList.add("card__content");

      filteredAssessments.sort(
        (a, b) =>
          new Date(a.due_at || a.unlock_at) - new Date(b.due_at || b.unlock_at)
      );
      filteredAssessments.forEach((assessment) => {
        const listItem = document.createElement("li");

        const link = document.createElement("a");
        link.textContent = assessment.name;
        link.href = assessment.html_url;
        link.target = "_blank";
        listItem.appendChild(link);

        const attemptsInfo = document.createElement("div");
        attemptsInfo.classList.add("attempts-info");
        const attemptsText =
          assessment.allowed_attempts > 0
            ? `Allowed Attempts: ${assessment.allowed_attempts}`
            : "Unlimited Attempts";
        attemptsInfo.innerHTML = attemptsText;
        listItem.appendChild(attemptsInfo);

        const dueDate = document.createElement("div");
        dueDate.classList.add("due-date");
        if (assessment.due_at) {
          dueDate.innerHTML = `Due: ${formatDate(assessment.due_at)}`;
        } else {
          dueDate.innerHTML = "No due date (Please check canvas)";
        }
        listItem.appendChild(dueDate);

        content.appendChild(listItem);
      });

      card.appendChild(title);
      card.appendChild(content);

      container.appendChild(card);
    }
  } catch (error) {
    console.error("Fetch error:", error);
  }
}

async function fetchAssessments(courseId) {
  const response = await fetch(
    `https://canvas-server-production.up.railway.app/api/courses/${courseId}/assignments`
  );
  if (!response.ok) {
    throw new Error(`Failed to fetch assessments for course ${courseId}`);
  }
  return await response.json();
}
// dates
function formatDate(dateString) {
  const date = new Date(dateString);
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const formattedDate = `${day}/${month}/${year} at ${hours}:${minutes}`;

  const timeDiff = date.getTime() - new Date().getTime();
  const daysRemaining = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
  let colorClass = "";
  if (daysRemaining <= 7) {
    colorClass = "red";
  } else if (daysRemaining <= 14) {
    colorClass = "orange";
  } else {
    colorClass = "green";
  }

  return `<span class="${colorClass}">${formattedDate}</span>`;
}
