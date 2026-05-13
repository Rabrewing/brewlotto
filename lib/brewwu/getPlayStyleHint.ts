import { BREWU_PLAY_STYLE_GUIDES } from './playStyleMatrix';

type GameId = 'pick3' | 'pick4' | 'cash5' | 'powerball' | 'mega';

export function getPlayStyleHint(gameKey: string): string {
  const guide = BREWU_PLAY_STYLE_GUIDES.find(
    (g) => g.id === gameKey || (gameKey === 'daily3' && g.id === 'pick3') || (gameKey === 'daily4' && g.id === 'pick4') || (gameKey === 'fantasy5' && g.id === 'cash5') || (gameKey === 'mega_millions' && g.id === 'mega')
  );
  return guide?.aiHint || '';
}

export function getPlayStyles(gameKey: string) {
  const guide = BREWU_PLAY_STYLE_GUIDES.find(
    (g) => g.id === gameKey || (gameKey === 'daily3' && g.id === 'pick3') || (gameKey === 'daily4' && g.id === 'pick4') || (gameKey === 'fantasy5' && g.id === 'cash5') || (gameKey === 'mega_millions' && g.id === 'mega')
  );
  return guide?.playStyles || [];
}

export function getGameOdds(gameKey: string): string {
  const guide = BREWU_PLAY_STYLE_GUIDES.find(
    (g) => g.id === gameKey || (gameKey === 'daily3' && g.id === 'pick3') || (gameKey === 'daily4' && g.id === 'pick4') || (gameKey === 'fantasy5' && g.id === 'cash5') || (gameKey === 'mega_millions' && g.id === 'mega')
  );
  return guide?.odds || '';
}
