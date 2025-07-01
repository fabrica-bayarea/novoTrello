import { getImageProps, ImageProps } from 'next/image'

/**
 * Componente Image do nextjs define style inline, entrando em conflito com CSP
 * Para resolver isso, criamos um componente Image, que receber todos props do Image
 * original, mas não define o style inline.
 */
const Image = (props: ImageProps) => {
  const { props: imageProps } = getImageProps({
    ...props,
  })

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { style, ...restOfProps } = imageProps

  const finalProps = {
    ...restOfProps,
    alt: restOfProps.alt || props.alt || '',
  }

  // eslint-disable-next-line @next/next/no-img-element
  return <img {...finalProps} />
}

export default Image