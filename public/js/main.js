(function () {
  'use strict';

  var list = document.getElementById('project-list');
  var status = document.getElementById('work-status');
  var form = document.getElementById('contact-form');
  var formStatus = document.getElementById('form-status');

  document.getElementById('year').textContent = new Date().getFullYear();

  function el(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }

  function safeUrl(url) {
    return /^https?:\/\//i.test(url || '') ? url : '';
  }

  function linkTo(url, label) {
    var a = el('a', '', label);
    a.href = url;
    a.rel = 'noopener';
    a.target = '_blank';
    return a;
  }

  function renderProject(project, index) {
    var li = el('li');
    var panelId = 'project-detail-' + index;

    var row = el('button', 'row');
    row.type = 'button';
    row.setAttribute('aria-expanded', 'false');
    row.setAttribute('aria-controls', panelId);
    row.appendChild(el('span', 'row-title', project.title));
    row.appendChild(el('span', 'row-summary', project.summary));
    row.appendChild(el('span', 'row-year', String(project.year || '')));

    var detail = el('div', 'detail');
    detail.id = panelId;
    detail.hidden = true;
    if (project.description) detail.appendChild(el('p', '', project.description));

    if (project.techStack && project.techStack.length) {
      var tags = el('ul', 'tags');
      project.techStack.forEach(function (tech) { tags.appendChild(el('li', '', tech)); });
      detail.appendChild(tags);
    }

    var links = el('div', 'detail-links');
    var live = safeUrl(project.liveUrl);
    var repo = safeUrl(project.repoUrl);
    if (live) links.appendChild(linkTo(live, 'View live site'));
    if (repo) links.appendChild(linkTo(repo, 'View source code'));
    if (links.children.length) detail.appendChild(links);

    row.addEventListener('click', function () {
      var open = row.getAttribute('aria-expanded') === 'true';
      row.setAttribute('aria-expanded', String(!open));
      detail.hidden = open;
    });

    li.appendChild(row);
    li.appendChild(detail);
    return li;
  }

  function loadProjects() {
    fetch('/api/projects')
      .then(function (res) {
        if (!res.ok) throw new Error('Request failed');
        return res.json();
      })
      .then(function (projects) {
        if (!projects.length) {
          status.textContent = 'No projects yet. Add some with the seed script or the admin API.';
          return;
        }
        status.textContent = 'Select a project to see details.';
        projects.forEach(function (p, i) { list.appendChild(renderProject(p, i)); });
      })
      .catch(function () {
        status.textContent = "Projects couldn't load. Check that the server and database are running, then refresh.";
      });
  }

  function setFormStatus(message, type) {
    formStatus.textContent = message;
    formStatus.className = 'form-status ' + (type || '');
  }

  form.addEventListener('submit', function (event) {
    event.preventDefault();
    var button = form.querySelector('button');
    var data = {
      name: form.name.value.trim(),
      email: form.email.value.trim(),
      message: form.message.value.trim()
    };

    if (!data.name || !data.email || !data.message) {
      setFormStatus('Fill in your name, email and message.', 'error');
      return;
    }

    button.disabled = true;
    setFormStatus('Sending…');

    fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
      .then(function (res) {
        return res.json().then(function (body) { return { ok: res.ok, body: body }; });
      })
      .then(function (result) {
        if (!result.ok) throw new Error(result.body.error || 'Message not sent.');
        form.reset();
        setFormStatus('Message sent. Thanks for reaching out.', 'success');
      })
      .catch(function (err) {
        setFormStatus(err.message || 'Message not sent. Try again.', 'error');
      })
      .finally(function () { button.disabled = false; });
  });

  loadProjects();
})();
