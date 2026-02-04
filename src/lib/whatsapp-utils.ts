/**
 * Utilitário para geração de links do WhatsApp com mensagens pré-formatadas.
 */

export function getWhatsAppLink(phone: string, message: string): string {
  // Remove caracteres não numéricos do telefone
  const cleanPhone = phone.replace(/\D/g, '');
  // Garante o código do país se não houver
  const formattedPhone = cleanPhone.length <= 11 ? `55${cleanPhone}` : cleanPhone;
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${formattedPhone}?text=${encodedMessage}`;
}

export const MSG_TEMPLATES = {
  EXAME_VENCENDO: (nome: string, exame: string, data: string) => 
    `Olá ${nome}, a Nextcon Saúde Empresarial informa que seu exame de ${exame} está com vencimento previsto para ${data}. Favor entrar em contato para agendamento.`,
  
  AVISO_GESTOR: (gestor: string, colaborador: string, exame: string) =>
    `Prezado ${gestor}, informamos que o colaborador ${colaborador} possui uma pendência de ${exame} que precisa ser regularizada. Atenciosamente, Nextcon.`,
    
  ALERTA_LIMBO: (colaborador: string) =>
    `Atenção: Identificamos um possível nexo NTEP para o colaborador ${colaborador}. Favor verificar o painel Sentinela do Limbo na plataforma NAI.`
};
