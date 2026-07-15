import { Component } from "react";
import ServerError from "../../pages/errors/ServerError";

export default class ErrorBoundary extends Component {

    constructor(props) {

        super(props);

        this.state = { hasError: false };

    }

    static getDerivedStateFromError() {

        return { hasError: true };

    }

    componentDidCatch(error, info) {

        console.error("Unhandled application error:", error, info);

    }

    render() {

        if (this.state.hasError) {

            return <ServerError />;

        }

        return this.props.children;

    }

}