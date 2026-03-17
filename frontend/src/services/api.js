// Simulasi fetch API untuk mock data
import { user, goals, portfolio, achievements } from '../data/mockData';

export function getUserProfile() {
  return Promise.resolve(user);
}

export function getGoals() {
  return Promise.resolve(goals);
}

export function getPortfolio() {
  return Promise.resolve(portfolio);
}

export function getAchievements() {
  return Promise.resolve(achievements);
}
