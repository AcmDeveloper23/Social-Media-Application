import {Menu, Container, Icon} from 'semantic-ui-react';
import { useRouter } from 'next/router';
import Link from 'next/link';

const Navbar = () => {

    const router = useRouter();

    // Check route path for Active link
    const isActive = route => router.pathname === route;

    return (
        <Menu fluid borderless>
            <Container text>
                <Link href="/login" passHref>
                    <Menu.Item header active={isActive("/login")}>
                        <Icon size="large" name="sign in" />
                            Login
                    </Menu.Item>
                </Link>

                <Link href="/register" passHref>
                    <Menu.Item header active={isActive("/register")}>
                        <Icon size="large" name="signup" />
                            Register
                    </Menu.Item>
                </Link>
            </Container>
        </Menu>
    )
}

export default Navbar;