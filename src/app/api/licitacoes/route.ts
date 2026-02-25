import { NextResponse } from 'next/server';

/**
 * @fileOverview API de integração com o Portal Nacional de Contratações Públicas (PNCP).
 * Filtra oportunidades governamentais específicas para o setor de SST.
 */

export async function GET() {
  try {
    // Palavras-chave estratégicas para filtragem técnica
    const keywords = '"Segurança do Trabalho" OR "PCMSO" OR "PGR" OR "LTCAT" OR "Medicina do Trabalho"';
    
    // Endpoint de busca da API pública do PNCP (Portal Nacional de Contratações Públicas)
    // Nota: O PNCP possui limites de taxa, o cache é essencial.
    const apiUrl = `https://pncp.gov.br/api/pncp/v1/contratacoes?q=${encodeURIComponent(keywords)}&pagina=1&tamanhoPagina=15`;

    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
      next: { revalidate: 3600 } // Cache de 1 hora para performance
    });

    if (!response.ok) {
      throw new Error(`Erro na API do PNCP: ${response.status}`);
    }

    const data = await response.json();

    // A estrutura do PNCP retorna os itens em data (ou similar dependendo da versão do endpoint)
    // Adaptamos para garantir que o frontend receba uma lista consistente
    return NextResponse.json({ 
      sucesso: true, 
      total: data.totalRegistros || 0,
      oportunidades: data.data || [] 
    });

  } catch (error) {
    console.error('Erro ao consultar licitações:', error);
    return NextResponse.json(
      { sucesso: false, erro: 'Não foi possível carregar as oportunidades públicas no momento.' },
      { status: 500 }
    );
  }
}
