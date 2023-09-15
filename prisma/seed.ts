import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  await prisma.prompt.deleteMany()

  await prisma.prompt.create({
    data: {
      title: 'Título YouTube',
      template: `Seu papel é gerar três títulos para um vídeo do YouTube.

Abaixo você receberá uma transcrição desse vídeo, use essa transcrição para gerar os títulos.
Abaixo você também receberá uma lista de títulos, use essa lista como referência para os títulos a serem gerados.

Os títulos devem ter no máximo 60 caracteres.
Os títulos devem ser chamativos e atrativos para maximizar os cliques.

Retorne APENAS os três títulos em formato de lista como no exemplo abaixo:
'''
- Título 1
- Título 2
- Título 3
'''

Transcrição:
'''
{transcription}
'''`.trim()
    }
  })

  await prisma.prompt.create({
    data: {
      title: 'Descrição YouTube',
      template: `Seu papel é gerar uma descrição sucinta para um vídeo do YouTube.
  
Abaixo você receberá uma transcrição desse vídeo, use essa transcrição para gerar a descrição.

A descrição deve possuir no máximo 80 palavras em primeira pessoa contendo os pontos principais do vídeo.

Use palavras chamativas e que cativam a atenção de quem está lendo.

Além disso, no final da descrição inclua uma lista de 3 até 10 hashtags em letra minúscula contendo palavras-chave do vídeo.

O retorno deve seguir o seguinte formato:
'''
Descrição.

#hashtag1 #hashtag2 #hashtag3 ...
'''

Transcrição:
'''
{transcription}
'''`.trim()
    }
  })

  await prisma.prompt.create({
    data: {
      title: 'Legendas',
      template: `Seu papel é gerar legendas para um vídeo do Youtube.
  
Abaixo você receberá uma transcrição desse vídeo, use essa transcrição para gerar legendas precisas.

O retorno deve seguir o seguinte formato:
'''
-Lengadas

'''

Transcrição:
'''
{transcription}
'''`.trim()
    }
  })

  await prisma.prompt.create({
    data: {
      title: 'Resumo/Citações',
      template: `Seu papel é gerar um resumo/citação
  
Abaixo você receberá uma transcrição desse vídeo, use essa transcrição para gerar resumo/citações precisa.
O resumo deve possuir no máximo 80 palavras.
Além disso, no final do resumo inclua uma lista de 3 até 10 informações resumidas/citações que ajudam a entender o video.
'''

O retorno deve seguir o seguinte formato:
'''
Resumo/Citações

- Lista
- Lista
- Lista

'''

Transcrição:
'''
{transcription}
'''`.trim()
    }
  })

  await prisma.prompt.create({
    data: {
      title: 'Custom',
      template: `Seu papel é gerar um(a) <escreva o que você precisa aqui>
  
Abaixo você receberá uma transcrição desse vídeo, use essa transcrição para gerar a <escreva o que você precisa aqui>.

O retorno deve seguir o seguinte formato:
'''
<escreva o retorno que deve conter na resposta>

'''

Transcrição:
'''
{transcription}
'''`.trim()
    }
  })
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })