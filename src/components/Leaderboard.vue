<template>
  <div class="leaderboard-page bg-white text-dark min-vh-100">
    <header class="bg-white text-dark py-3 shadow-sm border-bottom">
      <div class="container-fluid d-flex justify-content-between align-items-center">
        <h2 class="mb-0 fw-bold ps-3">🤖 AgentIssue-Bench</h2>
        </div>
    </header>

    <main class="container-fluid py-4 py-md-5">
      <div class="text-center mb-4 mb-md-5">
        <h1 class="display-4 fw-bolder">🏆 Leaderboard 🏆</h1>
        <p class="lead text-muted">Top-performing SE agent systems ranked by % Resolved</p>

        <div class="mt-4">
          <a
            href="https://github.com/alfin06/AgentIssue-Bench"
            target="_blank"
            rel="noopener noreferrer"
            class="btn btn-outline-dark mx-2"
            title="View Project on GitHub">
            <i class="bi bi-github"></i> GitHub
          </a>
          <a
            href="https://hub.docker.com/r/llmagents/agentissue-bench/tags"
            target="_blank"
            rel="noopener noreferrer"
            class="btn btn-outline-info mx-2"
            title="View on Docker Hub">
            <i class="bi bi-box-seam"></i> Docker Hub
          </a>
          <!-- <a
            href="#"
            target="_blank"
            rel="noopener noreferrer"
            class="btn btn-outline-secondary mx-2 disabled"
            title="Read the Paper (Coming Soon)"
            aria-disabled="true">
            <i class="bi bi-file-earmark-text"></i> Read the Paper (Soon)
          </a> -->
        </div>
      </div>

      <div class="row g-4">
        <div class="col-lg-8">
          <div class="card shadow-lg rounded-4 border h-100">
            <div class="card-body p-2 p-md-4">
              <div class="table-responsive">
                <table class="table table-striped table-hover mb-0 align-middle text-center fs-6">
                  <thead class="table-dark">
                    <tr>
                      <th scope="col" @click="sortBy('rank')" class="sortable-header">
                        Rank
                        <SortIcon :field="'rank'" :currentSort="sortKey" :direction="sortDirection" />
                      </th>
                      <th scope="col" @click="sortBy('system')" class="sortable-header">
                        Model
                        <SortIcon :field="'system'" :currentSort="sortKey" :direction="sortDirection" />
                      </th>
                      <th scope="col" @click="sortBy('institution')" class="sortable-header d-none d-md-table-cell">
                        Institution
                        <SortIcon :field="'institution'" :currentSort="sortKey" :direction="sortDirection" />
                      </th>
                      <th scope="col" @click="sortBy('score')" class="sortable-header">
                        % Resolved
                        <SortIcon :field="'score'" :currentSort="sortKey" :direction="sortDirection" />
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(entry, index) in paginatedData" :key="entry.system" class="leaderboard-row">
                      <td class="fw-bold rank-cell">
                         <span :class="getRankBadge(index + 1 + (currentPage - 1) * pageSize)">
                           {{ index + 1 + (currentPage - 1) * pageSize }}
                         </span>
                      </td>
                      <td class="text-start"><strong>{{ entry.system }}</strong></td>
                      <td class="d-none d-md-table-cell">
                        <img
                          :src="entry.institution"
                          :alt="entry.system + ' institution logo'"
                          class="institution-logo"
                          />
                      </td>
                      <td>
                        <span class="badge bg-success fs-6 px-3 py-2 rounded-pill">{{ entry.score.toFixed(2) }}%</span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
             <div class="card-footer bg-light border-0 py-3">
                <nav aria-label="Page navigation" class="d-flex justify-content-center">
                    <ul class="pagination mb-0">
                    <li class="page-item" :class="{ disabled: currentPage === 1 }">
                        <a class="page-link" href="#" @click.prevent="changePage(currentPage - 1)">Prev</a>
                    </li>
                    <li
                        v-for="page in totalPages"
                        :key="page"
                        class="page-item"
                        :class="{ active: currentPage === page }"
                    >
                        <a class="page-link" href="#" @click.prevent="changePage(page)">{{ page }}</a>
                    </li>
                    <li class="page-item" :class="{ disabled: currentPage === totalPages }">
                        <a class="page-link" href="#" @click.prevent="changePage(currentPage + 1)">Next</a>
                    </li>
                    </ul>
                </nav>
            </div>
          </div>
        </div>

        <div class="col-lg-4">
          <div class="vstack gap-4">
            <div class="card shadow-lg rounded-4 border h-100">
              <div class="card-body p-3 p-md-4">
                <h3 class="card-title text-center fw-bold mb-4">📊 Resolution Rate</h3>
                <hr/>
                <img :src="bar" alt="Resolution Rate Bar Chart" class="img-fluid rounded" />
              </div>
            </div>

            <div class="card shadow-lg rounded-4 border h-100">
              <div class="card-body p-3 p-md-4">
                <h3 class="card-title text-center fw-bold mb-4">📰 News Feed</h3>
                 <hr/>
                <ul class="list-group list-group-flush fs-6">
                  <li class="list-group-item bg-transparent text-dark border-bottom py-3">
                    <span class="badge bg-primary me-2">NEW</span>
                    [05/2025] Initial benchmark release!
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <footer class="bg-light text-center py-4 mt-auto border-top">
      <div class="container-fluid">
        <small class="text-muted">© 2025 AgentIssue-Bench Team.</small>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import Bar from "../assets/images/bar.png"; // Make sure this path is correct

// Sort icon component for visual indication (Bootstrap icons work well on light/dark)
const SortIcon = {
  props: ['field', 'currentSort', 'direction'],
  template: `
    <span v-if="currentSort === field" class="ms-1">
      <i v-if="direction === 'asc'" class="bi bi-sort-up"></i>
      <i v-else class="bi bi-sort-down-alt"></i>
    </span>
    <span v-else class="ms-1 text-muted">
       <i class="bi bi-arrow-down-up"></i>
    </span>
  `,
};

const leaderboard = ref([
  { system: 'AutoCodeRover + Claude 3.5 Sonnet', institution: 'https://avatars.githubusercontent.com/u/100131783?s=200&v=4', score: 12.67, link: 'https://autocoderover.dev/' },
  { system: 'Agentless + Claude 3.5 Sonnet', institution: 'https://brand.illinois.edu/wp-content/uploads/2024/02/Color-Variation-Orange-Block-I-White-Background.png', score: 8.67, link: 'https://github.com/OpenAutoCoder/Agentless' },
  { system: 'SWE-agent + Claude 3.5 Sonnet', institution: 'https://avatars.githubusercontent.com/u/166046056?s=200&v=4', score: 6.67, link: 'https://swe-agent.com/' },
  { system: 'Agentless + GPT-4o', institution: 'https://brand.illinois.edu/wp-content/uploads/2024/02/Color-Variation-Orange-Block-I-White-Background.png', score: 6.00, link: 'https://github.com/OpenAutoCoder/Agentless' },
  { system: 'AutoCodeRover + GPT-4o', institution: 'https://avatars.githubusercontent.com/u/100131783?s=200&v=4', score: 4.67, link: 'https://autocoderover.dev/' },
  { system: 'SWE-agent + GPT-4o', institution: 'https://avatars.githubusercontent.com/u/166046056?s=200&v=4', score: 3.33, link: 'https://swe-agent.com/' },
]);

const sortKey = ref('score');
const sortDirection = ref('desc');
const currentPage = ref(1);
const pageSize = 10;
const bar = Bar;

function sortBy(field) {
  if (sortKey.value === field) {
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc';
  } else {
    sortKey.value = field;
    sortDirection.value = (field === 'score' || field === 'rank') ? 'desc' : 'asc';
  }
  currentPage.value = 1;
}

const sortedData = computed(() => {
  const data = [...leaderboard.value].sort((a, b) => {
      let comparison = 0;
      const key = sortKey.value;
      if (key === 'rank') {
          comparison = b.score - a.score;
          if (comparison === 0) {
              comparison = a.system.localeCompare(b.system);
          }
          return sortDirection.value === 'asc' ? -comparison : comparison;
      }
      let aVal = a[key];
      let bVal = b[key];
      if (typeof aVal === 'string') {
          comparison = aVal.localeCompare(bVal);
      } else {
          comparison = aVal - bVal;
      }
      return sortDirection.value === 'asc' ? comparison : -comparison;
  });
  return data.map((item, index) => ({ ...item, rank: index + 1 }));
});

const totalPages = computed(() => Math.ceil(sortedData.value.length / pageSize));

const paginatedData = computed(() => {
  const start = (currentPage.value - 1) * pageSize;
  return sortedData.value.slice(start, start + pageSize);
});

function changePage(page) {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
  }
}

function getRankBadge(rank) {
    if (rank === 1) return 'badge bg-warning text-dark fs-6 px-3 py-2 rounded-pill'; // Gold
    if (rank === 2) return 'badge bg-secondary fs-6 px-3 py-2 rounded-pill'; // Silver
    if (rank === 3) return 'badge bg-danger fs-6 px-3 py-2 rounded-pill'; // Bronze-ish
    return 'badge bg-light text-dark border fs-6 px-2 py-1 rounded-pill'; // Standard
}

</script>

<style>
@import url('https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/font/bootstrap-icons.css');

/* Global Styles */
body {
  background-color: #ffffff;
  color: #212529;
  margin: 0;
  padding: 0;
  height: 100%;
  width: 100%;
  overflow-x: hidden;
}

.leaderboard-page {
  display: flex;
  flex-direction: column;
}

/* Header & Footer */
header, footer {
  flex-shrink: 0;
}
footer {
    background-color: #f8f9fa !important;
}

/* Main Content */
main.container-fluid {
  flex-grow: 1;
}

/* Cards */
.card {
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
  background-color: #ffffff;
  border-color: #dee2e6;
}

@media (hover: hover) {
    .card:hover {
        transform: translateY(-5px);
        box-shadow: 0 1rem 3rem rgba(0, 0, 0, 0.15) !important;
    }
    .leaderboard-row:hover {
        background-color: #e9ecef !important;
        transform: scale(1.01);
        box-shadow: 0 0 10px rgba(0,0,0,0.1);
        z-index: 10;
        position: relative;
    }
     .table th.sortable-header:hover {
        opacity: 0.8;
    }
    .pagination .page-link:hover {
        z-index: 2;
        color: #0a58ca;
        background-color: #e9ecef;
        border-color: #dee2e6;
    }
}

/* Table Enhancements */
.table th.sortable-header {
  cursor: pointer;
  user-select: none;
  transition: opacity 0.2s ease;
  color: #ffffff;
  padding: 0.8rem 0.5rem;
  white-space: nowrap;
}

.table td {
    padding: 0.8rem 0.5rem;
    vertical-align: middle;
}

.table thead.table-dark {
    background-color: #212529 !important;
    color: #ffffff !important;
    font-weight: bold;
    border-bottom: 3px solid #0d6efd;
}

.table-striped > tbody > tr:nth-of-type(odd) > * {
    background-color: rgba(0, 0, 0, 0.03);
}

.leaderboard-row {
  transition: background-color 0.15s ease, transform 0.2s ease;
}

.institution-logo {
  height: 2em;
  width: auto;
  max-width: 80px;
  background-color: #fff;
  border-radius: 5px;
  padding: 3px;
  object-fit: contain;
  border: 1px solid #eee;
}

.rank-cell .badge {
    min-width: 35px;
    font-size: 0.9em !important;
}

/* Pagination - Using standard Bootstrap */
.pagination .page-item.active .page-link {
    z-index: 3;
    color: #fff;
    background-color: #0d6efd;
    border-color: #0d6efd;
}

.pagination .page-link {
    color: #0d6efd;
    background-color: #fff;
    border: 1px solid #dee2e6;
    transition: background-color 0.2s ease, color 0.2s ease;
    padding: 0.375rem 0.75rem;
}

.pagination .page-item.disabled .page-link {
    color: #6c757d;
    pointer-events: none;
    background-color: #fff;
    border-color: #dee2e6;
}

/* News List */
.list-group-item {
    border-color: #dee2e6 !important;
    color: #212529 !important;
}

/* Ensure #app takes full height */
#app {
  height: 100%;
  width: 100%;
}

/* Link Icons */
.btn .bi {
    vertical-align: middle;
    margin-right: 0.5rem;
    font-size: 1.1rem; /* Adjust icon size in buttons */
}
/* Ensure button text aligns well */
.btn {
    display: inline-flex;
    align-items: center;
}

/* Specific Mobile Adjustments */
@media (max-width: 767.98px) {
    .display-4 {
        font-size: 2.5rem;
    }
    .table th.sortable-header,
    .table td {
        padding: 0.5rem 0.3rem;
    }
    .fs-6 {
        font-size: 0.85rem;
    }
     .pagination {
        font-size: 0.8rem;
    }
    .pagination .page-link {
       padding: 0.25rem 0.5rem;
    }
    .ps-3 {
        padding-left: 1rem !important;
    }
    .btn {
        padding: 0.375rem 0.75rem; /* Standard button size */
        font-size: 0.9rem;
        margin-top: 0.5rem !important; /* Stack buttons vertically */
        margin-left: 0 !important; /* Remove horizontal margin */
        margin-right: 0 !important;
        width: 60%; /* Make buttons take some width */
    }
    .mt-4 > .btn { /* Target buttons directly for stacking */
        display: block;
        margin-left: auto !important;
        margin-right: auto !important;
    }
}
</style>