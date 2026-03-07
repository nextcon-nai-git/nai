import { NextRequest, NextResponse } from 'next/server';
import { medicalAssistant } from '@/ai/flows/medical-assistant-flow';

/**
 * @fileOverview API Pública para o Assistente Médico NAI.
 * Processa dúvidas clínicas consultando banco de dados e base CID-10 via Tool Calling.
 */

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.mensagemMedico || !body.pacienteId) {
      return NextResponse.json(
        { sucesso: false, mensagem: "Mensagem e ID do Paciente são obrigatórios." },
        { status: 400 }
      );
    }

    const resposta = await medicalAssistant({
      mensagemMedico: body.mensagemMedico,
      pacienteId: body.pacienteId
    });

    return NextResponse.json({
      sucesso: true,
      resposta: resposta
    }, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      }
    });

  } catch (error: any) {
    console.error("Erro no Agente Médico NAI:", error);
    return NextResponse.json(
      { sucesso: false, mensagem: "Erro interno no processamento do agente neural." },
      { status: 500 }
    );
  }
}

// Handler para pre-flight requests do CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
