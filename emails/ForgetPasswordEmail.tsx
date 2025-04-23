import {
  Body,
  Button,
  Container,
  Head,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from '@react-email/components';

interface DropboxResetPasswordEmailProps {
  resetPasswordLink?: string;
}

const baseUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : '';

export const DropboxResetPasswordEmail = ({
  resetPasswordLink,
}: DropboxResetPasswordEmailProps) => {
  return (
    <Html>
      <Head />
      <Body className="bg-[#0F172A] py-10">
        <Preview>Vido Note reset your password</Preview>
        <Container className="bg-white border-4 border-[#0F172A] shadow-[8px_8px_0_#38BDF8] px-10 py-8 max-w-xl mx-auto">
          <Img
            src={`${baseUrl}/static/dropbox-logo.png`}
            width="40"
            height="33"
            alt="Dropbox"
            className="mb-6"
          />
          <Section>
            <Text className="text-[#0F172A] text-base mb-4">
              Someone recently requested a password change for your Vido Note
              account. If this was you, you can set a new password here:
            </Text>
            <Button
              className="bg-[#38BDF8] text-[#0F172A] font-bold py-3 px-6 rounded-none border-2 border-[#0F172A] shadow-[4px_4px_0_#0F172A] inline-block mt-4 mb-6"
              href={resetPasswordLink}
            >
              Reset password
            </Button>
            <Text className="text-[#0F172A] text-base mb-4">
              If you don&apos;t want to change your password or didn&apos;t request this, just ignore and delete this message.
            </Text>
            <Text className="text-[#0F172A] text-base mb-4">
              To keep your account secure, please don&apos;t forward this email to anyone. See our Help Center for{' '}
              <Link className="underline text-[#38BDF8]" href={resetPasswordLink}>
                more security tips
              </Link>.
            </Text>
            <Text className="text-[#0F172A] text-base font-bold">Happy Dropboxing!</Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

DropboxResetPasswordEmail.PreviewProps = {
  userFirstname: 'Alan',
  resetPasswordLink: 'https://www.dropbox.com',
} as DropboxResetPasswordEmailProps;

export default DropboxResetPasswordEmail;
