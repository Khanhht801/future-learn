(function () {
  "use strict";
  const data = window.parentDashboardData;
  if (!data) return;
  const select = function (selector) { return document.querySelector(selector); };
  const element = function (tag, className, content) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (content !== undefined) node.textContent = content;
    return node;
  };
  const icon = function (id) {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("class", "parent-icon");
    svg.setAttribute("aria-hidden", "true");
    const use = document.createElementNS(svg.namespaceURI, "use");
    use.setAttribute("href", "#icon-" + id);
    svg.append(use);
    return svg;
  };
  const percentage = function (subject) { return Math.round(subject.completed / subject.total * 100); };

  select("[data-learner-name]").textContent = data.learner.name;
  select("[data-learner-week]").textContent = data.learner.grade + " · Tuần " + data.weekLabel;
  select(".profile-button__avatar").textContent = data.learner.initials;
  select("[data-week-message]").textContent = "Con đã hoàn thành " + data.weeklyGoal.completed + " bài học trong tuần.";
  select("[data-week-completed]").textContent = data.weeklyGoal.completed + "/" + data.weeklyGoal.total;
  select("[data-week-progress]").max = data.weeklyGoal.total;
  select("[data-week-progress]").value = data.weeklyGoal.completed;
  select("[data-accuracy]").textContent = data.accuracy + "%";
  select("[data-accuracy-progress]").value = data.accuracy;
  select("[data-streak]").textContent = data.streakDays + " ngày";
  select("[data-parent-stars]").textContent = data.stars;
  select("[data-reward-chip]").setAttribute("aria-label", data.stars + " sao minh họa");

  data.subjects.forEach(function (subject) {
    const row = element("div", "subject-progress");
    const art = element("span", "subject-progress__art subject-progress__art--" + subject.id);
    if (subject.id === "math") {
      const image = element("img");
      image.src = "../shared/assets/math-planet.svg";
      image.alt = "";
      image.width = image.height = 50;
      art.append(image);
    } else art.append(icon("island"));
    const content = element("div");
    const heading = element("h3");
    const link = element("a", "", subject.name);
    link.href = subject.href;
    heading.append(link);
    const count = element("p", "", subject.completed + "/" + subject.total + " " + subject.unit + " đã hoàn thành");
    const progress = element("progress", subject.id === "english" ? "progress--green" : "");
    progress.max = subject.total;
    progress.value = subject.completed;
    progress.setAttribute("aria-label", "Tiến độ " + subject.name);
    progress.setAttribute("aria-valuetext", count.textContent);
    progress.dataset.subject = subject.id;
    content.append(heading, count, progress);
    row.append(art, content, element("strong", "subject-progress__percent", percentage(subject) + "%"));
    select("[data-subject-progress]").append(row);
  });

  function activityList(activities) {
    const list = element("ol", "activity-list");
    activities.forEach(function (activity) {
      const item = element("li", "activity--" + activity.subject);
      const link = element("a", "activity-link");
      link.href = activity.href;
      const art = element("span", "activity-icon");
      art.append(icon({ english: "book", math: "math", badges: "star" }[activity.subject]));
      const text = element("div", "activity-text");
      text.append(element("strong", "", activity.title), element("p", "", activity.detail));
      const time = element("time", "", activity.label);
      time.dateTime = activity.date;
      link.append(art, text, time);
      item.append(link);
      list.append(item);
    });
    return list;
  }
  select("[data-recent-activities]").replaceChildren(...activityList(data.activities.slice(0, 4)).children);

  function renderChart() {
    const weeks = Number(select("[data-chart-period]").value);
    const history = data.history.slice(-weeks);
    const svg = select("[data-progress-chart]");
    const svgNode = function (tag, attributes, content) {
      const node = document.createElementNS(svg.namespaceURI, tag);
      Object.entries(attributes || {}).forEach(function (entry) { node.setAttribute(entry[0], entry[1]); });
      if (content !== undefined) node.textContent = content;
      return node;
    };
    const x = function (index) { return 52 + index * 480 / (history.length - 1); };
    const y = function (value) { return 177 - value * 1.52; };
    const title = svgNode("title", { id: "progress-chart-title" }, "Tỷ lệ hoàn thành trong " + weeks + " tuần gần đây");
    svg.replaceChildren(title);
    [0, 25, 50, 75, 100].forEach(function (value) {
      svg.append(svgNode("line", { x1: 52, x2: 532, y1: y(value), y2: y(value), class: "chart-grid" }));
      svg.append(svgNode("text", { x: 40, y: y(value) + 5, "text-anchor": "end", class: "chart-label" }, value + "%"));
    });
    history.forEach(function (week, index) {
      svg.append(svgNode("text", { x: x(index), y: 205, "text-anchor": "middle", class: "chart-label" }, week.label));
    });
    ["math", "english"].forEach(function (subject) {
      const group = svgNode("g", { class: "chart-series--" + subject });
      const points = history.map(function (week, index) { return x(index) + "," + y(week[subject]); }).join(" ");
      group.append(svgNode("polygon", { points: "52,177 " + points + " 532,177", class: "chart-area" }));
      group.append(svgNode("polyline", { points: points, class: "chart-line" }));
      history.forEach(function (week, index) {
        const point = svgNode("circle", { cx: x(index), cy: y(week[subject]), r: 5, class: "chart-point" });
        point.append(svgNode("title", {}, week.label + ": " + week[subject] + "% " + (subject === "math" ? "Toán" : "tiếng Anh")));
        group.append(point);
      });
      svg.append(group);
    });
    const rows = history.map(function (week) {
      const row = element("tr");
      const label = element("th", "", week.label);
      label.scope = "row";
      row.append(label, element("td", "", week.math + "%"), element("td", "", week.english + "%"));
      return row;
    });
    select("[data-chart-table]").replaceChildren(...rows);
    const latest = history[history.length - 1];
    select("[data-chart-description]").textContent = "Tiến độ " + weeks + " tuần từ " + history[0].label + " đến " + latest.label + ". Tuần mới nhất: Toán " + latest.math + "%, tiếng Anh " + latest.english + "%. Xem bảng số liệu bên dưới để đọc từng tuần.";
    select("[data-chart-status]").textContent = "Đang hiển thị " + weeks + " tuần gần đây.";
  }
  select("[data-chart-period]").addEventListener("change", renderChart);
  renderChart();

  const dialog = select("[data-parent-dialog]");
  let returnFocus = null;
  function openDialog(title, content) {
    returnFocus = document.activeElement;
    select("[data-dialog-title]").textContent = title;
    select("[data-dialog-content]").replaceChildren(content);
    dialog.showModal();
    select("[data-dialog-close]").focus();
  }
  select("[data-open-progress]").addEventListener("click", function () {
    const report = element("div");
    report.append(element("p", "report-note", "Tiến độ minh họa, dùng chung dữ liệu với các trang học của con."));
    data.subjects.forEach(function (subject) {
      const section = element("section", "report-subject");
      section.append(element("h3", "", subject.name), element("p", "", subject.completed + "/" + subject.total + " " + subject.unit + " đã hoàn thành · " + percentage(subject) + "%"));
      const list = element("ul", "report-items");
      subject.items.forEach(function (item) {
        const row = element("li");
        row.append(element("strong", "", item.title), element("span", "", item.status));
        list.append(row);
      });
      const link = element("a", "parent-link", "Mở " + subject.name);
      link.href = subject.href;
      link.append(icon("arrow"));
      section.append(list, link);
      report.append(section);
    });
    openDialog("Chi tiết tiến độ học tập", report);
  });
  select("[data-open-activities]").addEventListener("click", function () {
    const content = element("div");
    content.append(element("p", "report-note", "Các hoạt động minh họa từ 17/10 đến 22/10/2026."), activityList(data.activities));
    openDialog("Tất cả hoạt động", content);
  });
  select("[data-open-profile]").addEventListener("click", function () {
    const content = element("div");
    content.append(element("p", "", data.learner.name + " · " + data.learner.grade), element("p", "report-note", "Bạn đang xem hồ sơ minh họa. Báo cáo sẽ được đồng bộ khi tài khoản học viên được kết nối."));
    openDialog("Hồ sơ học viên", content);
  });
  select("[data-dialog-close]").addEventListener("click", function () { dialog.close(); });
  dialog.addEventListener("keydown", function (event) {
    if (event.key !== "Tab") return;
    const controls = dialog.querySelectorAll("button, a[href]");
    const first = controls[0];
    const last = controls[controls.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });
  dialog.addEventListener("close", function () {
    if (returnFocus && returnFocus.isConnected) returnFocus.focus({ preventScroll: true });
  });
  dialog.addEventListener("click", function (event) {
    const bounds = dialog.getBoundingClientRect();
    if (event.target === dialog && (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom)) dialog.close();
  });
})();
