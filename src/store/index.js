import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    windowLoadingText: '',
    windowLoading: true,
    selectedProject: {},
    projects: {}
  },
  getters: {
    windowLoadingText: (state) => {
      return state.windowLoadingText
    },
    windowLoading: (state) => {
      return state.windowLoading
    },
    selectedProject: (state) => {
      return state.selectedProject
    },
    projects: (state) => {
      return state.projects
    },
    project: (state) => (id) => {
      return state.project[id]
    }
  },
  mutations: {
    setWindowLoadingText(state, text) {
      state.windowLoadingText = text
    },
    openWindowLoading(state) {
      state.windowLoadingText = ''
      state.windowLoading = true
    },
    closeWindowLoading(state) {
      state.windowLoading = false
    },
    setSelectedProject(state, project) {
      if (Object.is('string', typeof project) || Object.is('number', typeof project)) {
        state.selectedProject = state.projects[project]
      } else {
        state.selectedProject = project
      }
    },
    setProjects(state, projects) {
      state.projects = {}

      for (let project of projects) {
        state.projects[project['id']] = project
      }
    }
  },
  actions: {},
  modules: {}
})
